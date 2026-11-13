#!/usr/bin/env python3
"""Renderiza un episodio con la plantilla de su serie.

  python3 templates/_motor/render.py historia/<episodio>/escenas.json --formato youtube
  python3 templates/_motor/render.py historia/<episodio>/escenas.json --formato redes --desde 0 --hasta 140

- Lee la serie desde escenas.json ("serie") y usa templates/<serie>/tema.js.
- Si hay audio.mp3 junto al escenas.json (o --audio), lo mezcla.
- --cuadros N  guarda N cuadros de muestra en PNG para revisar sin renderizar todo.
- Avisa si hay tramos de más de 5 s sin cambio visual (regla de animación).
"""
import argparse, json, os, subprocess, sys, tempfile, math
from multiprocessing import Process

MOTOR = os.path.dirname(os.path.abspath(__file__))
INDEX = 'file://' + os.path.join(MOTOR, 'index.html')
CHROME = os.environ.get('APE_CHROME', '/usr/bin/google-chrome')


def abrir(pw, W, H):
    kw = dict(args=['--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-color-profile=srgb'])
    if os.path.exists(CHROME):
        kw['executable_path'] = CHROME
    b = pw.chromium.launch(**kw)
    p = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    p.on('pageerror', lambda e: print('ERROR JS:', e, file=sys.stderr))
    p.goto(INDEX)
    return b, p


def iniciar(p, serie, formato, data):
    return p.evaluate('([s,f,d]) => APE.init({serie:s, formato:f, escenas:d})', [serie, formato, data])


def trabajador(serie, formato, data, W, H, fps, f0, f1, salida, crf, esc=1.0):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b, p = abrir(pw, round(W * esc), round(H * esc))
        iniciar(p, serie, formato, data)
        if esc != 1.0:
            p.evaluate('([w,h]) => { const s=document.querySelector("svg"); s.setAttribute("width", w); s.setAttribute("height", h); document.body.style.width=w+"px"; document.body.style.height=h+"px"; }', [round(W * esc), round(H * esc)])
        ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', str(fps), '-i', '-',
                               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(crf), '-pix_fmt', 'yuv420p'] + (['-vf', f'scale={W}:{H}:flags=lanczos'] if esc != 1.0 else []) + [salida], stdin=subprocess.PIPE)
        for f in range(f0, f1):
            p.evaluate('t => APE.seek(t)', f / fps)
            ff.stdin.write(p.screenshot(type='jpeg', quality=93))
        ff.stdin.close(); ff.wait(); b.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('escenas')
    ap.add_argument('--formato', default='youtube', choices=['youtube', 'redes'])
    ap.add_argument('--salida')
    ap.add_argument('--audio')
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--desde', type=float, default=0)
    ap.add_argument('--hasta', type=float)
    ap.add_argument('--workers', type=int, default=max(1, min(4, (os.cpu_count() or 2) // 2)))
    ap.add_argument('--crf', type=int, default=20)
    ap.add_argument('--escala', type=float, default=1.0, help='renderiza más pequeño y reescala (más rápido)')
    ap.add_argument('--cuadros', type=int, default=0, help='solo guarda N cuadros PNG de muestra')
    ap.add_argument('--en', type=str, help='segundos separados por coma para los cuadros de muestra')
    a = ap.parse_args()

    data = json.load(open(a.escenas, encoding='utf-8'))
    serie = data.get('serie')
    base = os.path.dirname(os.path.abspath(a.escenas))
    W, H = (1080, 1920) if a.formato == 'redes' else (1920, 1080)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b, p = abrir(pw, W, H)
        info = iniciar(p, serie, a.formato, data)
        dur = info['duracion']
        beats = [x for x in info['beats']] + [dur]
        huecos = [(beats[i], beats[i + 1]) for i in range(len(beats) - 1) if beats[i + 1] - beats[i] > 5.0]
        for x, y in huecos:
            print(f'AVISO: {y - x:.1f} s sin cambio visual entre {x:.1f} y {y:.1f} s (regla: cada 3–5 s)')
        if a.cuadros or a.en:
            outdir = a.salida or os.path.join(base, f'cuadros_{a.formato}')
            os.makedirs(outdir, exist_ok=True)
            ts = [float(x) for x in a.en.split(',')] if a.en else [a.desde + (min(a.hasta or dur, dur) - a.desde) * (i + 0.5) / a.cuadros for i in range(a.cuadros)]
            for t in ts:
                p.evaluate('t => APE.seek(t)', t)
                p.screenshot(path=os.path.join(outdir, f'{t:07.2f}.png'))
            print('cuadros en', outdir)
            b.close(); return
        b.close()

    t0, t1 = a.desde, min(a.hasta or dur, dur)
    f0, f1 = int(round(t0 * a.fps)), int(round(t1 * a.fps))
    nombre = 'largo_youtube.mp4' if a.formato == 'youtube' else 'redes.mp4'
    salida = a.salida or os.path.join(base, nombre)
    tmp = tempfile.mkdtemp(prefix='ape_')
    n = max(1, min(a.workers, (f1 - f0) // 60 or 1))
    paso = math.ceil((f1 - f0) / n)
    partes, procs = [], []
    for i in range(n):
        s0, s1 = f0 + i * paso, min(f1, f0 + (i + 1) * paso)
        if s0 >= s1: continue
        out = os.path.join(tmp, f'p{i:03d}.mp4'); partes.append(out)
        pr = Process(target=trabajador, args=(serie, a.formato, data, W, H, a.fps, s0, s1, out, a.crf, a.escala)); pr.start(); procs.append(pr)
    for pr in procs: pr.join()
    lst = os.path.join(tmp, 'lista.txt')
    open(lst, 'w').write(''.join(f"file '{x}'\n" for x in partes))
    video = os.path.join(tmp, 'video.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', video], check=True)
    audio = a.audio or (os.path.join(base, 'audio.mp3') if os.path.exists(os.path.join(base, 'audio.mp3')) else None)
    if audio:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-ss', str(t0), '-t', str(t1 - t0), '-i', audio,
                        '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida], check=True)
    else:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-c', 'copy', '-movflags', '+faststart', salida], check=True)
    print('listo:', salida, f'({t1 - t0:.1f} s, {a.formato})')


if __name__ == '__main__':
    main()
