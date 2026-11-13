#!/usr/bin/env python3
"""Alinea las frases de guion.txt con audio.mp3 por las pausas (ffmpeg silencedetect) con programación dinámica.
Cada límite de frase cae en una pausa; minimiza el desajuste entre duración y largo de la frase
y penaliza pausas largas que queden dentro de una frase. Salida: frases.json junto al guion.
  python3 alinear.py <carpeta_episodio>
"""
import json, re, subprocess, os, argparse, math
ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--ruido', default='-38'); ap.add_argument('--min', type=float, default=0.12)
a = ap.parse_args()
txt = open(os.path.join(a.dir, 'guion.txt'), encoding='utf-8').read()
frases = [f.strip() for f in re.split(r'(?:(?<=[.!?:])|(?<=[.!?]"))\s+(?=[¿¡"A-ZÁÉÍÓÚÑ0-9])', txt.replace('\n', ' ')) if f.strip()]
audio = os.path.join(a.dir, 'audio.mp3')
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]))
log = subprocess.run(['ffmpeg', '-i', audio, '-af', f'silencedetect=noise={a.ruido}dB:d={a.min}', '-f', 'null', '-'], capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', log)]
se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
if len(se) < len(ss): se.append(dur)
P = [(s, e) for s, e in zip(ss, se)]
h0 = P[0][1] if P and P[0][0] <= 0.05 else 0.0
h1 = P[-1][0] if P and P[-1][1] >= dur - 0.05 else dur
P = [(s, e) for s, e in P if s > h0 + 0.05 and e < h1 - 0.05]
N, M = len(frases), len(P)
def peso(f): return len(re.sub(r'[^\wáéíóúñü]', '', f.lower())) + 3
c = [peso(f) for f in frases]
habla_tot = (h1 - h0) - sum(min(e - s, 0.6) for s, e in P) * 0.0
rate = sum(c) / (h1 - h0)  # caracteres por segundo (incluye pausas medias)
# puntos: 0 = inicio, 1..M pausas, M+1 = fin ; tiempo de inicio de frase = fin de pausa, fin de frase = inicio de pausa
def ini(j): return h0 if j == 0 else P[j - 1][1]
def fin(j): return h1 if j == M + 1 else P[j - 1][0]
plen = [0] + [e - s for s, e in P] + [0]
pref = [0.0]
for L in plen[1:M + 1]: pref.append(pref[-1] + (L if L > 0.28 else 0) ** 1.5)
INF = 1e18
def costo(k, j0, j1):
    d = fin(j1) - ini(j0); esp = c[k] / rate
    if d <= 0.2: return INF
    r = math.log(d / esp)
    dentro = pref[j1 - 1] - pref[j0] if j1 - 1 >= j0 else 0  # pausas no usadas dentro
    return r * r * 4 + dentro * 6 - (plen[j1] if j1 <= M else 0.5) * 1.2
best = [[INF] * (M + 2) for _ in range(N + 1)]; back = [[-1] * (M + 2) for _ in range(N + 1)]
best[0][0] = 0
for k in range(N):
    for j0 in range(M + 1):
        b0 = best[k][j0]
        if b0 >= INF: continue
        t0 = ini(j0); esp = c[k] / rate
        for j1 in range(j0 + 1, M + 2):
            if k < N - 1 and j1 == M + 1: break
            if k == N - 1 and j1 != M + 1: continue
            d = fin(j1) - t0
            if d > esp * 3 + 3: break
            v = b0 + costo(k, j0, j1)
            if v < best[k + 1][j1]: best[k + 1][j1] = v; back[k + 1][j1] = j0
js = [M + 1]
for k in range(N, 0, -1): js.append(back[k][js[-1]])
js = js[::-1]
out = [{'i': k, 'txt': frases[k], 'ini': round(ini(js[k]), 2), 'fin': round(fin(js[k + 1]), 2)} for k in range(N)]
json.dump({'duracion': round(dur, 2), 'frases': out}, open(os.path.join(a.dir, 'frases.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
for o in out:
    d = o['fin'] - o['ini']; esp = c[o['i']] / rate
    print(f"{o['i']:3d} {o['ini']:7.2f}-{o['fin']:7.2f} ({d:4.1f}s ~{esp:4.1f}) {o['txt'][:60]}")
print('pausas', M, 'frases', N, 'dur', round(dur, 1), 'rate', round(rate, 2))
