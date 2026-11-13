#!/bin/bash
# Cola de producción: cada línea "largo <dir> <nombre_largo>" o "cap <dir> <NN>". Render → comprimir → commit/push.
cd /home/claude/asipasoexplicado-media
R=templates/_motor/render.py
push() { for i in 1 2 3 4 5; do git pull -q --rebase origin main && git push -q origin main && return 0; sleep 20; done; return 1; }
comp_largo() { # $1 in $2 out (una pasada, tamaño fijo por bitrate)
  local dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
  local vb=$(python3 -c "print(int(90*8*1000/$dur - 160))")
  ffmpeg -nostdin -v error -y -i "$1" -c:v libx264 -preset veryfast -b:v ${vb}k -maxrate $((vb*3/2))k -bufsize $((vb*2))k -c:a aac -b:a 160k -movflags +faststart "$2"
}
while read -r tipo dir arg <&3; do
  [ -z "$tipo" ] && continue
  echo "== $(date -u +%H:%M) $tipo $dir $arg"
  if [ "$tipo" = largo ] && [ -f largos/$arg.mp4 ]; then continue; fi
  if [ "$tipo" = cap ] && [ -f $dir/capitulos/$arg/redes.mp4 ]; then continue; fi
  if [ "$tipo" = largo ]; then
    if [ ! -f $dir/largo_full.mp4 ]; then  # por tramos de 60 s, reanudable
      mkdir -p $dir/tramos; dur=$(python3 -c "import json;print(json.load(open('$dir/escenas.json'))['duracion'])")
      n=$(python3 -c "import math;print(math.ceil($dur/60))")
      for i in $(seq 0 $((n-1))); do
        tf=$dir/tramos/t$(printf %03d $i).mp4; [ -f $tf ] && continue
        python3 $R $dir/escenas.json --formato youtube --escala 0.6667 --workers 2 --desde $((i*60)) --hasta $(((i+1)*60)) --salida $tf.tmp.mp4 </dev/null 2>&1 | grep -v AVISO && mv $tf.tmp.mp4 $tf
      done
      ls $dir/tramos/t*.mp4 | sed "s/^/file '\/home\/claude\/asipasoexplicado-media\//; s/$/'/" > $dir/tramos/lista.txt
      ffmpeg -nostdin -v error -y -f concat -safe 0 -i $dir/tramos/lista.txt -map 0:v -c copy $dir/tramos/video.mp4 && \
      ffmpeg -nostdin -v error -y -i $dir/tramos/video.mp4 -i $dir/audio_pad.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart $dir/largo_full.mp4 && rm -rf $dir/tramos
    fi
    comp_largo $dir/largo_full.mp4 largos/$arg.mp4 && rm -f $dir/largo_full.mp4
    git add largos/$arg.mp4 $dir/escenas.py $dir/escenas.json $dir/frases.json $dir/guion.txt $dir/audio.mp3 templates
    git commit -qm "Largo $arg" ; push && echo "LISTO largo $arg $(du -m largos/$arg.mp4 | cut -f1)MB"
  else
    c=$dir/capitulos/$arg
    python3 $R $c/escenas.json --formato redes --escala 0.6667 --workers 2 --salida $c/redes_full.mp4 </dev/null 2>&1 | grep -v AVISO
    ffmpeg -nostdin -v error -y -i $c/redes_full.mp4 -c:v libx264 -preset veryfast -b:v 4200k -maxrate 5000k -bufsize 8000k -c:a aac -b:a 128k -movflags +faststart $c/redes.mp4 && rm -f $c/redes_full.mp4
    git add $c/redes.mp4 $c/escenas.json $c/audio.mp3
    git commit -qm "$dir capítulo $arg para redes"; push && echo "LISTO cap $dir $arg $(du -m $c/redes.mp4 | cut -f1)MB"
  fi
done 3< "$1"
echo "== COLA TERMINADA $(date -u +%H:%M)"
