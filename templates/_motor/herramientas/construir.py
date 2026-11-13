#!/usr/bin/env python3
"""Arma escenas.json del largo y de cada capítulo a partir de frases.json + un guion de escenas compacto (escenas.py).

escenas.py define:
  SERIE, TITULO, PALABRA, PROXIMO, PERSONAJES={}, CIERRE_SEG=6
  E = [ (k, {escena}), ... ]   k = índice de la frase donde empieza la escena (float = fracción dentro de la frase)
       dentro de la escena, cualquier campo 't' puede ser un número de frase como cadena: 'f12' o 'f12.5'
       texto puede darse como [('f12','txt'), ...]
  COMPARTIR = k (frase del aviso)   CAPITULOS = [k0, k1, ...] frases donde empieza cada capítulo
Salida: escenas.json, audio_pad.mp3 y capitulos/NN/{escenas.json,audio.mp3}
"""
import json, os, sys, subprocess, copy, runpy
d = sys.argv[1]
S = runpy.run_path(os.path.join(d, 'escenas.py'))
F = json.load(open(os.path.join(d, 'frases.json'), encoding='utf-8'))
fr, dur = F['frases'], F['duracion']
N = len(fr)
def T(k):
    k = float(k); i = int(k); q = k - i
    if i >= N: return fr[-1]['fin']
    a, b = fr[i]['ini'], fr[i]['fin']
    return a + (b - a) * q
def tval(v, base):
    if isinstance(v, str) and v.startswith('f'): return round(max(0.05, T(v[1:]) - base + 0.05), 2)
    return v
import re as _re
def resolver(o, base):
    if isinstance(o, dict): return {kk: (tval(vv, base) if isinstance(vv, str) and _re.match(r'^f[\d.]+$', vv) else resolver(vv, base)) for kk, vv in o.items()}
    if isinstance(o, list): return [resolver(x, base) for x in o]
    return o
E_ = S['E']
cierre_seg = S.get('CIERRE_SEG', 6)
fin_habla = fr[-1]['fin']
total = round(max(dur, fin_habla) + cierre_seg, 2)
esc = []
for idx, (k, e) in enumerate(E_):
    ini = 0.0 if idx == 0 else round(T(k) - 0.15, 2)
    fin = round(T(E_[idx + 1][0]) - 0.15, 2) if idx + 1 < len(E_) else round(max(dur, fin_habla) + 0.2, 2)
    e = copy.deepcopy(e)
    if 'texto' in e: e['texto'] = [{'t': t, 'txt': x} if isinstance((t, x), tuple) else t for t, x in [(z if isinstance(z, tuple) else (z['t'], z['txt'])) for z in e['texto']]]
    e = resolver(e, ini)
    esc.append({'tipo': e.pop('tipo'), 'inicio': ini, 'fin': fin, **e})
cier_ini = esc[-1]['fin']
esc.append({'tipo': 'cierre', 'inicio': cier_ini, 'fin': total, 'palabra': S['PALABRA'], 'proximo': S.get('PROXIMO', '')})
c0 = T(S['COMPARTIR']) - 0.1
data = {'serie': S['SERIE'], 'titulo': S['TITULO'], 'duracion': total, 'personajes': S.get('PERSONAJES', {}), 'escenas': esc,
        'superpuestos': [{'tipo': 'compartir', 'inicio': round(c0, 2), 'fin': round(c0 + 5, 2)}]}
json.dump(data, open(os.path.join(d, 'escenas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
def pad(src, out, t0, t1, extra):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0), '-t', str(t1 - t0), '-i', src, '-af', f'apad=pad_dur={extra}', '-c:a', 'libmp3lame', '-b:a', '160k', out], check=True)
pad(os.path.join(d, 'audio.mp3'), os.path.join(d, 'audio_pad.mp3'), 0, dur, cierre_seg + 0.5)
# capítulos
caps = S.get('CAPITULOS', [])
for n, k0 in enumerate(caps):
    t0 = 0.0 if n == 0 else round(T(k0) - 0.15, 2)
    t1 = round(T(caps[n + 1]) - 0.15, 2) if n + 1 < len(caps) else round(max(dur, fin_habla) + 0.2, 2)
    sel = []
    for e in esc[:-1]:
        if e['fin'] <= t0 + 0.01 or e['inicio'] >= t1 - 0.01: continue
        e2 = copy.deepcopy(e); a, b = max(e['inicio'], t0), min(e['fin'], t1)
        shift = a - e['inicio']
        def mov(o):
            if isinstance(o, dict): return {kk: (round(vv - shift, 2) if (kk == 't' or kk == 't2' or kk == 'tTronos' or kk == 'tCoronas') and isinstance(vv, (int, float)) else mov(vv)) for kk, vv in o.items()}
            if isinstance(o, list): return [mov(x) for x in o]
            return o
        e2 = mov(e2); e2['inicio'] = round(a - t0, 2); e2['fin'] = round(b - t0, 2)
        sel.append(e2)
    L = round(t1 - t0, 2); cs = 3.5
    sel.append({'tipo': 'cierre', 'inicio': L, 'fin': round(L + cs, 2), 'palabra': S['PALABRA']})
    sup = []
    if t0 <= c0 < t1: sup.append({'tipo': 'compartir', 'inicio': round(c0 - t0, 2), 'fin': round(c0 - t0 + 5, 2)})
    else: sup.append({'tipo': 'compartir', 'inicio': round(L * 0.5, 2), 'fin': round(L * 0.5 + 4.5, 2)})
    cd = os.path.join(d, 'capitulos', f'{n + 1:02d}'); os.makedirs(cd, exist_ok=True)
    json.dump({'serie': S['SERIE'], 'titulo': f"{S['TITULO']} · capítulo {n + 1}", 'duracion': round(L + cs, 2), 'personajes': S.get('PERSONAJES', {}), 'escenas': sel, 'superpuestos': sup},
              open(os.path.join(cd, 'escenas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    pad(os.path.join(d, 'audio.mp3'), os.path.join(cd, 'audio.mp3'), t0, t1, cs + 0.3)
    print(f'capítulo {n + 1:02d}: {t0:7.2f}-{t1:7.2f} ({L:5.1f} s)')
# chequeo de huecos visuales (aprox: inicio de escena + cada t)
beats = []
for e in esc:
    beats.append(e['inicio'])
    def tt(o):
        if isinstance(o, dict):
            for kk, vv in o.items():
                if kk == 't' and isinstance(vv, (int, float)): beats.append(e['inicio'] + vv)
                else: tt(vv)
        elif isinstance(o, list): [tt(x) for x in o]
    tt({k: v for k, v in e.items() if k not in ('inicio', 'fin')})
beats = sorted(beats) + [total]
for a, b in zip(beats, beats[1:]):
    if b - a > 5: print(f'hueco {b - a:.1f}s en {a:.1f}')
print('escenas', len(esc), 'duración', total)
