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
  if [ "$tipo" = largo ]; then
    [ -f $dir/largo_full.mp4 ] || python3 $R $dir/escenas.json --formato youtube --escala 0.6667 --workers 2 --audio $dir/audio_pad.mp3 --salida $dir/largo_full.mp4 </dev/null 2>&1 | grep -v AVISO
    comp_largo $dir/largo_full.mp4 largos/$arg.mp4 && rm -f $dir/largo_full.mp4
    git add largos/$arg.mp4 $dir/escenas.py $dir/escenas.json $dir/frases.json $dir/guion.txt $dir/audio.mp3 templates
    git commit -qm "Largo $arg" ; push && echo "LISTO largo $arg $(du -m largos/$arg.mp4 | cut -f1)MB"
  else
    c=$dir/capitulos/$arg
    python3 $R $c/escenas.json --formato redes --escala 0.6667 --workers 2 --salida $c/redes_full.mp4 </dev/null 2>&1 | grep -v AVISO
    ffmpeg -nostdin -v error -y -i $c/redes_full.mp4 -c:v libx264 -preset medium -b:v 4200k -maxrate 5000k -bufsize 8000k -c:a aac -b:a 128k -movflags +faststart $c/redes.mp4 && rm -f $c/redes_full.mp4
    git add $c/redes.mp4 $c/escenas.json $c/audio.mp3
    git commit -qm "$dir capítulo $arg para redes"; push && echo "LISTO cap $dir $arg $(du -m $c/redes.mp4 | cut -f1)MB"
  fi
done 3< "$1"
echo "== COLA TERMINADA $(date -u +%H:%M)"
