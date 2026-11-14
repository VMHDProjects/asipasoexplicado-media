#!/usr/bin/env python3
"""Motor de la serie "GTA 6 explicado" (Así Pasó Explicado).

Dibuja cada cuadro con PIL/numpy (determinista) y lo manda a ffmpeg.
  python3 templates/gta/render_gta.py gta/largos/<slug>/escenas.json                       # largo 16:9 → largo_youtube.mp4
  python3 templates/gta/render_gta.py <escenas.json> --formato vertical --desde 0 --hasta 38 --salida short1.mp4
  python3 templates/gta/render_gta.py <escenas.json> --en 3,30,90                            # cuadros de muestra PNG

Estilo: cero fondos fijos (grid synthwave, ciudad nocturna con autopista, mapa de Leonida, pantalla tech,
rayos, franjas, circuitos, anillos), subtítulos blancos con borde negro grueso y palabra clave en amarillo,
contadores, líneas de tiempo, fichas de personajes con siluetas propias. Nada de logos ni arte de Rockstar.
Música: beat synthwave propio sintetizado con numpy, a -20 dB bajo la voz.

escenas.json: {"duracion": s, "escenas": [{"inicio","fin","fondo","tipo", ...campos}], "subs": [{"ini","fin","txt"}]}
Tipos: titulo, icono, iconos, contador, fecha, linea_tiempo, mapa, ficha, pareja, galeria, telefono, precio,
barras, descarga, compartir, cierre.  *palabra* = amarillo.
"""
import argparse, json, math, os, subprocess, sys, tempfile, random
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTES = os.path.join(AQUI, '..', '_motor', 'fuentes')
F_BLACK = os.path.join(FUENTES, 'InterDisplay-Black.otf')
F_BOLD = os.path.join(FUENTES, 'InterDisplay-Bold.otf')
F_CN = os.path.join(FUENTES, 'HerosCn-Bold.otf')

AMAR = (255, 212, 0); BLANCO = (255, 255, 255); NEGRO = (0, 0, 0)
ROSA = (255, 46, 136); CIAN = (25, 227, 255); MORADO = (123, 44, 255); NARANJA = (255, 138, 0); ROJO = (240, 40, 60)
VERDE = (60, 240, 140)

W = H = 0; V = False; U = 1.0


def setup(formato):
    global W, H, V, U
    if formato == 'vertical':
        W, H, V = 720, 1280, True
    else:
        W, H, V = 1280, 720, False
    U = 1.0


# ---------------------------------------------------------------- utilidades
def cl(x, a=0.0, b=1.0): return max(a, min(b, x))
def p(t, a, b): return 1.0 if t >= b else (0.0 if t <= a else (t - a) / (b - a))
def eo(x): return 1 - (1 - x) ** 3
def back(x):
    c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def lerp(a, b, t): return a + (b - a) * t
def mixc(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


@lru_cache(maxsize=64)
def fnt(path, size): return ImageFont.truetype(path, int(size))


LUTS = {}
def put(fr, spr, cx, cy, sc=1.0, a=1.0, ax=0.5, ay=0.5):
    if spr is None or sc <= 0.01 or a <= 0.01: return
    if abs(sc - 1) > 0.004:
        spr = spr.resize((max(1, int(spr.width * sc)), max(1, int(spr.height * sc))), Image.BILINEAR)
    if a < 0.995:
        k = int(a * 64)
        lut = LUTS.get(k)
        if lut is None: lut = LUTS[k] = [int(v * k / 64) for v in range(256)]
        spr = spr.copy(); spr.putalpha(spr.getchannel('A').point(lut))
    x = int(round(cx - spr.width * ax)); y = int(round(cy - spr.height * ay))
    sx0, sy0 = max(0, -x), max(0, -y)
    sx1, sy1 = min(spr.width, W - x), min(spr.height, H - y)
    if sx1 <= sx0 or sy1 <= sy0: return
    fr.alpha_composite(spr, (x + sx0, y + sy0), (sx0, sy0, sx1, sy1))


def ss(w, h, fn, k=3):
    """Dibujo supermuestreado (antialias): fn(draw, k) en un lienzo k veces más grande."""
    im = Image.new('RGBA', (int(w * k), int(h * k)), (0, 0, 0, 0))
    fn(ImageDraw.Draw(im), k, im)
    return im.resize((int(w), int(h)), Image.LANCZOS)


# ---------------------------------------------------------------- texto
def tokens(txt):
    out = []; hl = False
    for part in txt.split('*'):
        for w in part.split():
            out.append((w, hl))
        hl = not hl
    return out


_TC = {}
def texto(txt, size, maxw=None, fill=BLANCO, hl=AMAR, font=F_BLACK, upper=False, stroke=0.15, lh=1.12, align='c'):
    key = (txt, int(size), maxw, fill, hl, font, upper, stroke, align)
    if key in _TC: return _TC[key]
    if upper: txt = txt.upper()
    f = fnt(font, size); sw = max(2, int(size * stroke))
    tk = tokens(txt); sp = f.getlength(' ')
    maxw = maxw or 10 ** 6
    lines = [[]]; lw = 0
    for w, h in tk:
        wd = f.getlength(w)
        add = wd + (sp if lines[-1] else 0)
        if lines[-1] and lw + add > maxw:
            lines.append([(w, h, wd)]); lw = wd
        else:
            lines[-1].append((w, h, wd)); lw += add
    widths = [sum(x[2] for x in ln) + sp * (len(ln) - 1) for ln in lines]
    tw = int(max(widths) + 2 * sw + 4); lhp = size * lh
    th = int(lhp * len(lines) + size * 0.3 + 2 * sw)
    im = Image.new('RGBA', (tw, th), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for li, ln in enumerate(lines):
        x = sw + 2 + ((tw - 2 * sw - 4 - widths[li]) / 2 if align == 'c' else 0)
        y = sw + li * lhp
        for w, h, wd in ln:
            d.text((x, y), w, font=f, fill=hl if h else fill, stroke_width=sw, stroke_fill=NEGRO)
            x += wd + sp
    _TC[key] = im
    return im


def caja(txt, size, bg=AMAR, fg=NEGRO, font=F_CN, pad=0.35):
    key = ('caja', txt, size, bg, fg)
    if key in _TC: return _TC[key]
    f = fnt(font, size); txt = txt.upper()
    tw = f.getlength(txt); bb = f.getbbox(txt)
    pw = int(size * pad * 1.6); ph = int(size * pad)
    w, h = int(tw + 2 * pw), int(bb[3] - bb[1] + 2 * ph)
    def dr(d, k, im):
        d.rounded_rectangle((0, 0, w * k - 1, h * k - 1), radius=int(6 * k), fill=NEGRO)
        d.rounded_rectangle((3 * k, 3 * k, w * k - 3 * k, h * k - 3 * k), radius=int(5 * k), fill=bg)
    im = ss(w, h, dr)
    ImageDraw.Draw(im).text((pw, ph - bb[1]), txt, font=f, fill=fg)
    _TC[key] = im
    return im


# ---------------------------------------------------------------- fondos animados
_BG = {}
def grad(c1, c2, w, h, horizontal=False):
    a = np.linspace(0, 1, h if not horizontal else w)[:, None] if not horizontal else np.linspace(0, 1, w)[None, :]
    c1 = np.array(c1, float); c2 = np.array(c2, float)
    if not horizontal:
        g = c1[None, None, :] * (1 - a[:, :, None]) + c2[None, None, :] * a[:, :, None]
        g = np.repeat(g, w, axis=1)
    else:
        g = c1[None, None, :] * (1 - a[:, :, None]) + c2[None, None, :] * a[:, :, None]
        g = np.repeat(g, h, axis=0)
    return Image.fromarray(g.astype(np.uint8), 'RGB').convert('RGBA')


def vineta():
    if 'vin' not in _BG:
        y, x = np.mgrid[0:H, 0:W]
        r = np.sqrt(((x - W / 2) / (W / 2)) ** 2 + ((y - H / 2) / (H / 2)) ** 2)
        a = (np.clip((r - 0.65) / 0.75, 0, 1) ** 1.6 * 200).astype(np.uint8)
        im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); im.putalpha(Image.fromarray(a))
        _BG['vin'] = im
    return _BG['vin']


def bg_grid(t, pal):
    c = pal or (ROSA, CIAN)
    key = ('grid', c)
    hz = int(H * (0.56 if not V else 0.5))
    if key not in _BG:
        im = grad((14, 0, 40), (110, 10, 90), W, hz)
        base = Image.new('RGBA', (W, H), (8, 0, 22, 255)); base.paste(im, (0, 0))
        R = int(min(W, H) * 0.26)
        def sol(d, k, img):
            for i in range(2 * R):
                y = i * k
                col = mixc(AMAR, c[0], i / (2 * R))
                d.line([(0, y), (2 * R * k, y)], fill=col + (255,), width=k)
            # franjas del sol
            for j in range(6):
                yy = int((R * 1.05 + j * R * 0.16) * k)
                d.rectangle((0, yy, 2 * R * k, yy + int((2 + j * 1.6) * k)), fill=(0, 0, 0, 0))
        sun = ss(2 * R, 2 * R, sol, k=2)
        m = Image.new('L', (2 * R * 2, 2 * R * 2), 0); ImageDraw.Draw(m).ellipse((0, 0, 4 * R - 1, 4 * R - 1), fill=255)
        m = m.resize((2 * R, 2 * R), Image.LANCZOS)
        a = np.minimum(np.array(sun.getchannel('A')), np.array(m)); sun.putalpha(Image.fromarray(a))
        glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse((W / 2 - R * 1.5, hz - R * 1.9, W / 2 + R * 1.5, hz + R * 1.1), fill=c[0] + (120,))
        glow = glow.filter(ImageFilter.GaussianBlur(40))
        base.alpha_composite(glow)
        base.alpha_composite(sun, (W // 2 - R, hz - int(R * 1.55)))
        # montañas
        mt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dm = ImageDraw.Draw(mt)
        rnd = random.Random(3); pts = [(0, hz)]; x = 0
        while x < W:
            x += rnd.randint(40, 110); pts.append((x, hz - rnd.randint(10, int(H * 0.09))))
        pts += [(W, hz)]
        dm.polygon(pts, fill=(30, 6, 60, 255), outline=c[1] + (255,))
        base.alpha_composite(mt)
        base = base.crop((0, 0, W, hz + 1))
        _BG[key] = base
    fr = Image.new('RGBA', (W, H), (10, 0, 26, 255)); fr.paste(_BG[key], (0, 0))
    d = ImageDraw.Draw(fr)
    gh = H - hz
    for i in range(16):
        z = ((i + t * 1.6) % 16) / 16
        y = hz + gh * z ** 2.2
        col = mixc((60, 10, 90), c[0], min(1, z * 1.6))
        d.line([(0, y), (W, y)], fill=col, width=max(1, int(1 + 3 * z)))
    for j in range(-14, 15):
        xb = W / 2 + j * W * 0.11
        d.line([(W / 2 + j * 8, hz), (xb, H)], fill=c[0], width=2)
    d.line([(0, hz), (W, hz)], fill=c[1], width=3)
    return fr


def bg_ciudad(t, pal):
    c = pal or (ROSA, CIAN)
    key = ('ciudad', c)
    road = int(H * (0.8 if not V else 0.78))
    if key not in _BG:
        sky = grad((4, 2, 22), (60, 12, 80), W, road)
        rnd = random.Random(7); ds = ImageDraw.Draw(sky)
        for _ in range(120):
            x, y = rnd.randint(0, W), rnd.randint(0, int(road * 0.6)); ds.point((x, y), fill=(255, 255, 255, rnd.randint(80, 255)))
        ds.ellipse((W * 0.78, H * 0.08, W * 0.78 + 60, H * 0.08 + 60), fill=(255, 230, 240, 255))
        layers = []
        for li, (col, hmin, hmax, win) in enumerate([((40, 14, 80), 0.18, 0.42, 0.05), ((14, 6, 30), 0.12, 0.34, 0.35)]):
            lw = W * 2
            L = Image.new('RGBA', (lw, road), (0, 0, 0, 0)); dl = ImageDraw.Draw(L)
            x = 0; r2 = random.Random(11 + li)
            while x < lw:
                bw = r2.randint(40, 110); bh = int(road * r2.uniform(hmin, hmax) * (1.6 if r2.random() < 0.15 else 1))
                dl.rectangle((x, road - bh, x + bw, road), fill=col + (255,))
                if r2.random() < 0.3: dl.rectangle((x + bw // 2 - 2, road - bh - 18, x + bw // 2 + 2, road - bh), fill=col + (255,))
                for wy in range(road - bh + 8, road - 6, 12):
                    for wx in range(x + 6, x + bw - 6, 11):
                        if r2.random() < win: dl.rectangle((wx, wy, wx + 4, wy + 5), fill=(c[r2.randint(0, 1)] if r2.random() < 0.4 else AMAR) + (255,))
                if li == 1 and r2.random() < 0.25:  # palmera
                    px = x + bw + 8; py = road
                    dl.line([(px, py), (px + 6, py - 90)], fill=(10, 4, 20, 255), width=5)
                    for a in range(0, 360, 45):
                        ex = px + 6 + 36 * math.cos(math.radians(a)); ey = py - 90 + 16 * math.sin(math.radians(a)) + 10
                        dl.line([(px + 6, py - 90), (ex, ey)], fill=(10, 4, 20, 255), width=4)
                x += bw + r2.randint(0, 10)
            # contorno neón de las azoteas
            layers.append(L)
        _BG[key] = (sky, layers)
    sky, layers = _BG[key]
    fr = Image.new('RGBA', (W, H), (6, 2, 16, 255)); fr.paste(sky, (0, 0))
    for li, L in enumerate(layers):
        off = int((t * (14 if li == 0 else 40)) % W)
        fr.alpha_composite(L.crop((off, 0, off + W, road)), (0, 0))
    d = ImageDraw.Draw(fr)
    d.rectangle((0, road, W, H), fill=(18, 14, 26))
    d.line([(0, road), (W, road)], fill=c[0], width=4)
    mid = road + (H - road) * 0.5
    for i in range(14):
        x = ((i * 120 - t * 500) % (W + 120)) - 60
        d.rectangle((x, mid - 3, x + 60, mid + 3), fill=AMAR)
    rnd = random.Random(5)
    for i in range(10):
        sp = rnd.uniform(300, 700); y0 = road + (H - road) * (0.25 if i % 2 else 0.75); ph = rnd.uniform(0, W)
        if i % 2:
            x = (ph + t * sp) % (W + 200) - 100; col = (255, 250, 220)
        else:
            x = W - ((ph + t * sp) % (W + 200) - 100); col = (255, 40, 60)
        d.line([(x - 50, y0), (x, y0)], fill=col, width=4)
        d.ellipse((x - 5, y0 - 5, x + 5, y0 + 5), fill=col)
    return fr


def bg_tech(t, pal):
    c = pal or (CIAN, MORADO)
    fr = Image.new('RGBA', (W, H), (4, 10, 28, 255)); d = ImageDraw.Draw(fr)
    g = 48; off = (t * 20) % g
    for x in np.arange(-g + off, W + g, g): d.line([(x, 0), (x, H)], fill=(12, 38, 70), width=1)
    for y in np.arange(-g + off, H + g, g): d.line([(0, y), (W, y)], fill=(12, 38, 70), width=1)
    sy = (t * 160) % (H + 200) - 100
    for k in range(40):
        a = 1 - k / 40; d.line([(0, sy - k), (W, sy - k)], fill=mixc((4, 10, 28), c[0], 0.35 * a), width=1)
    L = 40; m = 24
    for (x, y, sxn, syn) in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
        d.line([(x, y), (x + sxn * L, y)], fill=c[0], width=4); d.line([(x, y), (x, y + syn * L)], fill=c[0], width=4)
    rnd = random.Random(int(t * 8))
    for i in range(14):
        h = rnd.randint(6, 70); x = m + 10 + i * 10
        d.rectangle((x, H - m - 20 - h, x + 6, H - m - 20), fill=c[1])
    for i in range(6):
        y = H * 0.2 + i * 18; w = 80 + 60 * abs(math.sin(t * 1.3 + i))
        d.rectangle((W - m - 20 - w, y, W - m - 20, y + 8), fill=c[0] if i % 2 else c[1])
    return fr


def bg_rayos(t, pal):
    c = pal or (MORADO, ROSA)
    fr = Image.new('RGBA', (W, H), mixc(c[0], NEGRO, 0.55) + (255,)); d = ImageDraw.Draw(fr)
    cx, cy = W / 2, H * 0.42; R = max(W, H) * 1.2; n = 18; rot = t * 0.25
    for i in range(n):
        a0 = rot + i * 2 * math.pi / n; a1 = a0 + math.pi / n
        d.polygon([(cx, cy), (cx + R * math.cos(a0), cy + R * math.sin(a0)), (cx + R * math.cos(a1), cy + R * math.sin(a1))], fill=mixc(c[1], NEGRO, 0.35))
    return fr


def bg_franjas(t, pal):
    c = pal or (NARANJA, ROSA, MORADO)
    if len(c) < 3: c = (c[0], c[1], MORADO)
    fr = Image.new('RGBA', (W, H), (20, 6, 30, 255)); d = ImageDraw.Draw(fr)
    bw = 90; off = (t * 120) % (bw * 3)
    for i in range(-4, int((W + H) / bw) + 4):
        x = i * bw + off - H
        col = mixc(c[i % 3], (20, 6, 30), 0.25)
        d.polygon([(x, H), (x + bw, H), (x + bw + H, 0), (x + H, 0)], fill=col)
    return fr


def bg_circuitos(t, pal):
    c = pal or (VERDE, CIAN)
    key = ('circ', c)
    if key not in _BG:
        im = Image.new('RGBA', (W, H), (2, 18, 20, 255)); d = ImageDraw.Draw(im)
        rnd = random.Random(9); paths = []
        for _ in range(26):
            x, y = rnd.randrange(0, W, 30), rnd.randrange(0, H, 30); pts = [(x, y)]
            for _ in range(rnd.randint(3, 7)):
                if rnd.random() < 0.5: x += rnd.choice([-1, 1]) * rnd.randint(2, 8) * 30
                else: y += rnd.choice([-1, 1]) * rnd.randint(2, 6) * 30
                pts.append((x, y))
            d.line(pts, fill=mixc((2, 18, 20), c[0], 0.35), width=3)
            for q in (pts[0], pts[-1]): d.ellipse((q[0] - 6, q[1] - 6, q[0] + 6, q[1] + 6), outline=mixc((2, 18, 20), c[0], 0.6), width=3)
            paths.append(pts)
        _BG[key] = (im, paths)
    im, paths = _BG[key]
    fr = im.copy(); d = ImageDraw.Draw(fr)
    for i, pts in enumerate(paths):
        segs = [math.dist(pts[k], pts[k + 1]) for k in range(len(pts) - 1)]; tot = sum(segs) or 1
        pos = ((t * 220 + i * 137) % (tot * 1.5))
        if pos > tot: continue
        for k, s in enumerate(segs):
            if pos <= s:
                f = pos / s if s else 0
                x = lerp(pts[k][0], pts[k + 1][0], f); y = lerp(pts[k][1], pts[k + 1][1], f)
                col = c[i % 2]
                d.ellipse((x - 6, y - 6, x + 6, y + 6), fill=col)
                break
            pos -= s
    return fr


def bg_anillos(t, pal):
    c = pal or (ROSA, CIAN)
    base = (16, 4, 34)
    fr = Image.new('RGBA', (W, H), base + (255,)); d = ImageDraw.Draw(fr)
    cx, cy = W / 2, H * 0.42; mr = math.hypot(W, H) * 0.6
    for k in range(10):
        r = (t * 90 + k * mr / 10) % mr
        a = 1 - r / mr
        col = mixc(base, c[k % 2], a * 0.9)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=col, width=max(2, int(6 * a)))
    return fr


def bg_mapa(t, pal):
    fr = Image.new('RGBA', (W, H), (3, 20, 44, 255)); d = ImageDraw.Draw(fr)
    g = 60; off = (t * 10) % g
    for x in np.arange(-g + off, W + g, g): d.line([(x, 0), (x, H)], fill=(10, 40, 72), width=1)
    for y in np.arange(-g + off, H + g, g): d.line([(0, y), (W, y)], fill=(10, 40, 72), width=1)
    for k in range(4):
        y = H * (0.15 + 0.22 * k) + 8 * math.sin(t * 0.8 + k)
        d.arc((-W * 0.2, y - 40, W * 1.2, y + 40), 200, 340, fill=(20, 70, 110), width=2)
    return fr


FONDOS = dict(grid=bg_grid, ciudad=bg_ciudad, tech=bg_tech, rayos=bg_rayos, franjas=bg_franjas,
              circuitos=bg_circuitos, anillos=bg_anillos, mapa=bg_mapa)


# ---------------------------------------------------------------- íconos (dibujados en un espacio 0..100)
OW = 3.2
def icono_spr(nombre, size=220, color=None):
    key = ('ico', nombre, size, color)
    if key in _TC: return _TC[key]
    col = color or AMAR
    def dr(d, k, im):
        s = size * k / 100.0
        def P(v): return [(x * s, y * s) for x, y in v]
        def R(x0, y0, x1, y1, f, r=4): d.rounded_rectangle((x0 * s, y0 * s, x1 * s, y1 * s), radius=r * s, fill=f, outline=NEGRO, width=int(OW * s))
        def E(x0, y0, x1, y1, f): d.ellipse((x0 * s, y0 * s, x1 * s, y1 * s), fill=f, outline=NEGRO, width=int(OW * s))
        def G(v, f): d.polygon(P(v), fill=f, outline=NEGRO, width=int(OW * s))
        def L(v, f=NEGRO, w=4): d.line(P(v), fill=f, width=int(w * s), joint='curve')
        def T(x, y, txt, sz, f=BLANCO):
            ft = fnt(F_BLACK, sz * s); d.text((x * s, y * s), txt, font=ft, fill=f, anchor='mm', stroke_width=int(2.5 * s), stroke_fill=NEGRO)
        n = nombre
        if n == 'martillo':
            G([(46, 40), (56, 40), (60, 92), (42, 92)], (150, 90, 40)); R(18, 14, 82, 42, (180, 186, 196), 5)
        elif n == 'mando':
            G([(14, 40), (86, 40), (94, 76), (80, 84), (66, 66), (34, 66), (20, 84), (6, 76)], (60, 60, 80))
            R(22, 50, 38, 56, BLANCO, 1); R(27, 45, 33, 61, BLANCO, 1)
            for (x, y, c2) in [(70, 46, ROSA), (78, 53, CIAN), (62, 53, VERDE), (70, 60, AMAR)]: E(x - 4, y - 4, x + 4, y + 4, c2)
        elif n == 'reloj':
            E(12, 12, 88, 88, BLANCO); L([(50, 50), (50, 24)], w=6); L([(50, 50), (68, 58)], w=6); E(45, 45, 55, 55, ROJO)
        elif n == 'arena':
            G([(24, 10), (76, 10), (54, 50), (76, 90), (24, 90), (46, 50)], (220, 240, 255)); G([(34, 76), (66, 76), (72, 88), (28, 88)], AMAR); G([(34, 22), (66, 22), (52, 42), (48, 42)], AMAR)
        elif n == 'ojo':
            G([(6, 50), (28, 26), (72, 26), (94, 50), (72, 74), (28, 74)], BLANCO); E(34, 34, 66, 66, CIAN); E(43, 43, 57, 57, NEGRO)
        elif n == 'candado':
            d.arc((28 * s, 10 * s, 72 * s, 56 * s), 180, 360, fill=NEGRO, width=int(12 * s)); d.arc((28 * s, 10 * s, 72 * s, 56 * s), 180, 360, fill=(190, 196, 206), width=int(6 * s))
            R(18, 40, 82, 90, col, 6); E(44, 55, 56, 67, NEGRO); R(47, 62, 53, 78, NEGRO, 1)
        elif n == 'pin':
            G([(50, 94), (22, 50), (20, 34), (30, 16), (50, 8), (70, 16), (80, 34), (78, 50)], ROJO); E(38, 24, 62, 48, BLANCO)
        elif n == 'play':
            R(8, 20, 92, 80, ROJO, 16); G([(40, 34), (66, 50), (40, 66)], BLANCO)
        elif n == 'pelicula':
            E(10, 10, 90, 90, (60, 60, 70))
            for a in range(0, 360, 72): x = 50 + 24 * math.cos(math.radians(a)); y = 50 + 24 * math.sin(math.radians(a)); E(x - 9, y - 9, x + 9, y + 9, (20, 20, 30))
            E(44, 44, 56, 56, BLANCO)
        elif n == 'vinilo':
            E(8, 8, 92, 92, (25, 25, 30)); E(34, 34, 66, 66, ROSA); E(46, 46, 54, 54, NEGRO)
            d.arc((18 * s, 18 * s, 82 * s, 82 * s), 200, 250, fill=(120, 120, 130), width=int(2 * s))
        elif n == 'silencio':
            G([(10, 38), (28, 38), (50, 18), (50, 82), (28, 62), (10, 62)], BLANCO); L([(62, 36), (88, 64)], ROJO, 8); L([(88, 36), (62, 64)], ROJO, 8)
        elif n == 'trofeo':
            d.arc((8 * s, 18 * s, 40 * s, 52 * s), 90, 270, fill=NEGRO, width=int(6 * s)); d.arc((60 * s, 18 * s, 92 * s, 52 * s), 270, 90, fill=NEGRO, width=int(6 * s))
            G([(24, 12), (76, 12), (70, 46), (56, 60), (44, 60), (30, 46)], AMAR); R(44, 58, 56, 76, AMAR, 1); R(28, 76, 72, 90, (150, 90, 40), 2)
        elif n == 'laptop':
            R(16, 16, 84, 66, (40, 44, 60), 3); R(21, 21, 79, 61, (10, 14, 30), 1); G([(6, 70), (94, 70), (88, 82), (12, 82)], (150, 156, 170))
            G([(50, 26), (66, 54), (34, 54)], AMAR); T(50, 45, '!', 18, NEGRO)
        elif n == 'palmera':
            L([(50, 92), (54, 40)], (120, 70, 30), 9)
            for a, l in [(200, 36), (240, 30), (300, 30), (340, 36), (180, 28), (0, 28)]:
                ex = 54 + l * math.cos(math.radians(a)); ey = 38 + l * 0.7 * math.sin(math.radians(a)) + 8
                G([(54, 36), (ex, ey), ((54 + ex) / 2, (36 + ey) / 2 + 8)], (40, 200, 110))
        elif n == 'guantes':
            R(14, 24, 48, 72, ROJO, 16); R(52, 24, 86, 72, ROJO, 16); R(18, 70, 44, 86, BLANCO, 2); R(56, 70, 82, 86, BLANCO, 2)
        elif n == 'rejas':
            R(10, 10, 90, 90, (40, 44, 60), 4)
            for x in range(22, 86, 14): R(x, 10, x + 6, 90, (180, 186, 196), 1)
        elif n == 'maletin':
            R(34, 16, 66, 34, None, 4); R(10, 28, 90, 84, (120, 70, 30), 6); R(44, 48, 56, 60, AMAR, 1)
        elif n == 'sirena':
            G([(26, 70), (32, 30), (68, 30), (74, 70)], ROJO); R(16, 70, 84, 86, (60, 60, 70), 2)
            for a in (200, 270, 340): L([(50 + 34 * math.cos(math.radians(a)), 26 + 22 * math.sin(math.radians(a))), (50 + 46 * math.cos(math.radians(a)), 26 + 30 * math.sin(math.radians(a)))], AMAR, 6)
        elif n == 'lapida':
            G([(22, 90), (22, 36), (30, 18), (50, 10), (70, 18), (78, 36), (78, 90)], (160, 164, 176)); L([(50, 28), (50, 60)], NEGRO, 6); L([(38, 40), (62, 40)], NEGRO, 6); R(8, 86, 92, 94, (60, 120, 50), 1)
        elif n == 'radio':
            R(12, 30, 88, 88, (40, 44, 60), 6); L([(70, 30), (84, 6)], NEGRO, 5); E(20, 44, 52, 76, (90, 96, 110)); R(58, 44, 80, 54, CIAN, 1); R(58, 62, 80, 72, ROJO, 1)
        elif n == 'club':
            L([(50, 4), (50, 18)], NEGRO, 4); E(18, 16, 82, 80, (200, 210, 230))
            for i in range(4): L([(22 + i * 2, 30 + i * 12), (78 - i * 2, 30 + i * 12)], (120, 130, 160), 3)
            for i in range(4): L([(30 + i * 13, 18), (30 + i * 13, 78)], (120, 130, 160), 3)
        elif n == 'microfono':
            R(34, 8, 66, 54, (180, 186, 196), 16); d.arc((24 * s, 26 * s, 76 * s, 70 * s), 0, 180, fill=NEGRO, width=int(6 * s)); L([(50, 70), (50, 86)], NEGRO, 6); L([(34, 88), (66, 88)], NEGRO, 6)
        elif n == 'edificios':
            R(8, 40, 36, 92, (90, 80, 160), 2); R(34, 14, 66, 92, (60, 140, 200), 2); R(64, 30, 92, 92, (200, 80, 140), 2)
            for y in range(24, 86, 12): R(42, y, 48, y + 6, AMAR, 0); R(52, y, 58, y + 6, AMAR, 0)
        elif n == 'corazon':
            G([(50, 88), (12, 50), (10, 30), (22, 14), (38, 12), (50, 26), (62, 12), (78, 14), (90, 30), (88, 50)], ROSA)
        elif n == 'comentario':
            R(8, 14, 92, 70, BLANCO, 14); G([(24, 66), (40, 66), (20, 90)], BLANCO)
            for x in (32, 50, 68): E(x - 5, 37, x + 5, 47, NEGRO)
        elif n == 'compartir':
            G([(10, 44), (56, 14), (56, 32), (90, 32), (90, 58), (56, 58), (56, 76)], CIAN)
        elif n == 'seguir':
            E(30, 10, 60, 40, BLANCO); G([(14, 88), (18, 56), (32, 46), (58, 46), (72, 56), (76, 88)], BLANCO); E(62, 50, 94, 82, VERDE); L([(78, 56), (78, 76)], NEGRO, 5); L([(68, 66), (88, 66)], NEGRO, 5)
        elif n == 'billetera':
            R(8, 26, 88, 82, (120, 70, 30), 8); R(60, 42, 94, 66, (150, 90, 40), 6); E(68, 48, 80, 60, AMAR); R(18, 16, 70, 30, VERDE, 2)
        elif n == 'prohibido':
            E(8, 8, 92, 92, ROJO); E(22, 22, 78, 78, BLANCO); L([(28, 72), (72, 28)], ROJO, 12)
        elif n == 'caja':
            G([(14, 30), (50, 14), (86, 30), (86, 76), (50, 92), (14, 76)], (60, 60, 80)); G([(14, 30), (50, 46), (86, 30), (50, 14)], (90, 90, 120)); L([(50, 46), (50, 92)], NEGRO, 3)
            G([(20, 40), (46, 52), (46, 80), (20, 68)], ROSA)
        elif n == 'disco':
            E(8, 8, 92, 92, (210, 215, 230)); E(18, 18, 82, 82, (180, 200, 240)); E(42, 42, 58, 58, NEGRO)
        elif n == 'codigo':
            R(10, 10, 90, 90, BLANCO, 4); rr = random.Random(4)
            for i in range(7):
                for j in range(7):
                    if rr.random() < 0.5: d.rectangle(((18 + i * 9.4) * s, (18 + j * 9.4) * s, (26 + i * 9.4) * s, (26 + j * 9.4) * s), fill=NEGRO)
            for (x, y) in [(18, 18), (64, 18), (18, 64)]: R(x, y, x + 18, y + 18, BLANCO, 1); R(x + 5, y + 5, x + 13, y + 13, NEGRO, 0)
        elif n == 'pc':
            R(8, 12, 92, 68, (40, 44, 60), 4); R(14, 18, 86, 62, CIAN, 1); R(42, 68, 58, 82, (150, 156, 170), 0); R(26, 82, 74, 90, (150, 156, 170), 2)
        elif n == 'consola':
            R(28, 8, 72, 92, BLANCO, 8); R(44, 14, 56, 86, (30, 30, 40), 3)
        elif n == 'consola2':
            R(22, 10, 78, 92, (30, 30, 36), 6); E(38, 18, 62, 42, VERDE)
        elif n == 'globo':
            E(8, 8, 92, 92, CIAN); d.arc((28 * s, 8 * s, 72 * s, 92 * s), 0, 360, fill=NEGRO, width=int(3 * s)); L([(8, 50), (92, 50)], NEGRO, 3); L([(16, 30), (84, 30)], NEGRO, 3); L([(16, 70), (84, 70)], NEGRO, 3)
        elif n == 'dinero':
            for i in range(3): R(8 + i * 4, 52 - i * 16, 88 + i * 4, 82 - i * 16, (80, 200, 110), 3)
            E(40, 26, 64, 46, (40, 150, 70)); T(52, 36, '$', 18)
        elif n == 'libro':
            G([(50, 22), (90, 14), (90, 80), (50, 88)], (90, 80, 200)); G([(50, 22), (10, 14), (10, 80), (50, 88)], (120, 110, 230))
        elif n == 'ciudad':
            R(10, 46, 30, 92, (90, 80, 160), 1); R(30, 20, 52, 92, (60, 140, 200), 1); R(52, 36, 70, 92, (200, 80, 140), 1); R(70, 54, 90, 92, (90, 80, 160), 1)
        elif n == 'sol':
            for a in range(0, 360, 30): L([(50 + 30 * math.cos(math.radians(a)), 44 + 30 * math.sin(math.radians(a))), (50 + 44 * math.cos(math.radians(a)), 44 + 44 * math.sin(math.radians(a)))], AMAR, 6)
            E(26, 20, 74, 68, AMAR); G([(0, 84), (25, 76), (50, 84), (75, 76), (100, 84), (100, 100), (0, 100)], CIAN)
        elif n == 'caiman':
            G([(4, 60), (30, 48), (60, 46), (96, 56), (60, 62), (60, 70), (30, 70)], (70, 150, 60))
            for x in range(34, 60, 7): G([(x, 47), (x + 3, 40), (x + 6, 47)], (70, 150, 60))
            E(76, 46, 84, 54, AMAR); L([(70, 58), (96, 57)], NEGRO, 2)
        elif n == 'campo':
            G([(0, 70), (40, 56), (100, 66), (100, 96), (0, 96)], (90, 170, 70)); G([(54, 46), (70, 32), (86, 46), (86, 68), (54, 68)], ROJO); R(64, 54, 76, 68, BLANCO, 1)
        elif n == 'montana':
            G([(2, 88), (36, 22), (56, 52), (68, 36), (98, 88)], (100, 110, 140)); G([(28, 38), (36, 22), (44, 38), (36, 34)], BLANCO)
        elif n == 'estrella':
            pts = []
            for i in range(10):
                r = 44 if i % 2 == 0 else 18; a = -math.pi / 2 + i * math.pi / 5; pts.append((50 + r * math.cos(a), 52 + r * math.sin(a)))
            G(pts, (110, 140, 70))
        elif n == 'cartas':
            for i, rot in enumerate([-18, 0, 18]):
                cx, cy = 50 + (i - 1) * 16, 54; a = math.radians(rot)
                pts = [(cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)) for x, y in [(-16, -26), (16, -26), (16, 26), (-16, 26)]]
                G(pts, BLANCO)
            T(66, 50, '♠', 22, NEGRO)
        elif n == 'pregunta':
            E(8, 8, 92, 92, col); T(50, 52, '?', 64)
        elif n == 'campana':
            G([(50, 10), (70, 22), (74, 60), (86, 74), (14, 74), (26, 60), (30, 22)], AMAR); E(42, 72, 58, 88, AMAR)
        elif n == 'fiesta':
            G([(20, 90), (44, 30), (70, 60)], ROSA)
            for (x, y, c2) in [(60, 16, AMAR), (80, 28, CIAN), (74, 10, VERDE), (88, 50, ROSA), (52, 8, CIAN)]: R(x, y, x + 7, y + 7, c2, 1)
        elif n == 'pelea':
            G([(50, 6), (60, 36), (92, 30), (66, 52), (86, 86), (52, 64), (20, 92), (34, 56), (6, 40), (40, 36)], AMAR)
        elif n == 'cohete':
            G([(50, 6), (66, 30), (66, 70), (34, 70), (34, 30)], BLANCO); E(42, 30, 58, 46, CIAN); G([(34, 50), (20, 76), (34, 70)], ROJO); G([(66, 50), (80, 76), (66, 70)], ROJO); G([(40, 72), (50, 96), (60, 72)], NARANJA)
        else:
            E(8, 8, 92, 92, col)
    im = ss(size, size, dr, k=2)
    _TC[key] = im
    return im


def tachon(size):
    key = ('tachon', size)
    if key not in _TC:
        def dr(d, k, im):
            s = size * k
            d.line([(0.12 * s, 0.12 * s), (0.88 * s, 0.88 * s)], fill=NEGRO, width=int(0.16 * s)); d.line([(0.88 * s, 0.12 * s), (0.12 * s, 0.88 * s)], fill=NEGRO, width=int(0.16 * s))
            d.line([(0.12 * s, 0.12 * s), (0.88 * s, 0.88 * s)], fill=ROJO, width=int(0.1 * s)); d.line([(0.88 * s, 0.12 * s), (0.12 * s, 0.88 * s)], fill=ROJO, width=int(0.1 * s))
        _TC[key] = ss(size, size, dr, k=2)
    return _TC[key]


# ---------------------------------------------------------------- siluetas propias
def silueta(tipo='hombre', size=260, color=CIAN, extra=None):
    key = ('sil', tipo, size, color, extra)
    if key in _TC: return _TC[key]
    def dr(d, k, im):
        s = size * k / 100.0
        def P(v): return [(x * s, y * s) for x, y in v]
        ow = int(OW * s)
        body = (22, 22, 34); rim = color
        def figura(dx=0, mujer=False, gorra=False, sc=1.0, c=rim):
            def T(v): return P([(50 + (x - 50) * sc + dx, 100 - (100 - y) * sc) for x, y in v])
            if mujer:
                d.polygon(T([(30, 30), (36, 12), (50, 6), (64, 12), (70, 30), (72, 62), (28, 62)]), fill=body, outline=c, width=ow)
            d.polygon(T([(8, 100), (12, 78), (26, 66), (42, 62), (58, 62), (74, 66), (88, 78), (92, 100)]), fill=body, outline=c, width=ow)
            d.polygon(T([(43, 50), (57, 50), (58, 64), (42, 64)]), fill=body)
            cx, cy, r = 50, 32, 18
            bb = T([(cx - r * 0.85, cy - r), (cx + r * 0.85, cy + r * 1.1)])
            d.ellipse((bb[0][0], bb[0][1], bb[1][0], bb[1][1]), fill=body, outline=c, width=ow)
            if gorra:
                d.chord(tuple(x for q in T([(32, 10), (68, 40)]) for x in q), 180, 360, fill=c)
                d.polygon(T([(60, 24), (80, 24), (80, 28), (60, 28)]), fill=c)
        if tipo == 'mujer': figura(mujer=True)
        elif tipo == 'gorra': figura(gorra=True)
        elif tipo == 'dos_mujeres':
            figura(dx=-18, mujer=True, sc=0.86, c=ROSA); figura(dx=18, mujer=True, sc=0.86, c=CIAN)
        else: figura()
        if extra == 'pregunta':
            ft = fnt(F_BLACK, 34 * s); d.text((50 * s, 34 * s), '?', font=ft, fill=AMAR, anchor='mm', stroke_width=int(3 * s), stroke_fill=NEGRO)
    im = ss(size, size, dr, k=2)
    _TC[key] = im
    return im


def disco_fondo(r, c1, c2):
    key = ('disc', r, c1, c2)
    if key not in _TC:
        def dr(d, k, im):
            d.ellipse((0, 0, 2 * r * k - 1, 2 * r * k - 1), fill=c1 + (255,), outline=NEGRO, width=int(5 * k))
            d.ellipse((r * k * 0.18, r * k * 0.18, r * k * 1.82, r * k * 1.82), outline=c2 + (255,), width=int(4 * k))
        _TC[key] = ss(2 * r, 2 * r, dr)
    return _TC[key]


# ---------------------------------------------------------------- mapa de Leonida (esquema propio)
LEONIDA = [(0.06, 0.10), (0.22, 0.08), (0.40, 0.10), (0.58, 0.07), (0.70, 0.12), (0.72, 0.24), (0.76, 0.36), (0.80, 0.48),
           (0.84, 0.60), (0.83, 0.70), (0.78, 0.78), (0.70, 0.82), (0.62, 0.80), (0.55, 0.72), (0.47, 0.62), (0.42, 0.50),
           (0.36, 0.40), (0.30, 0.30), (0.22, 0.24), (0.12, 0.22), (0.05, 0.18)]
CAYOS = [(0.66, 0.86, 0.025), (0.60, 0.89, 0.02), (0.53, 0.91, 0.022), (0.46, 0.92, 0.018), (0.40, 0.925, 0.016), (0.34, 0.92, 0.014)]
REGIONES = {
    'kalaga': (0.55, 0.15, 'MONTE KALAGA', (90, 200, 110)),
    'portgellhorn': (0.20, 0.17, 'PORT GELLHORN', (120, 160, 230)),
    'ambrosia': (0.60, 0.32, 'AMBROSIA', (210, 150, 90)),
    'grassrivers': (0.62, 0.58, 'GRASSRIVERS', (70, 170, 90)),
    'vicecity': (0.78, 0.66, 'VICE CITY', (255, 46, 136)),
    'cayos': (0.50, 0.91, 'CAYOS DE LEONIDA', (25, 227, 255)),
}
MS = 1400


def mapa_spr():
    if 'mapa' in _TC: return _TC['mapa']
    def dr(d, k, im):
        S = MS * k
        P = [(x * S, y * S) for x, y in LEONIDA]
        d.polygon(P, fill=(18, 60, 70), outline=CIAN, width=int(6 * k))
        for x, y, r in CAYOS:
            d.ellipse(((x - r) * S, (y - r * 0.6) * S, (x + r) * S, (y + r * 0.6) * S), fill=(18, 60, 70), outline=CIAN, width=int(5 * k))
        d.line([((x) * S, y * S) for x, y, r in CAYOS], fill=(200, 200, 220), width=int(4 * k))
        # zonas
        for key, (x, y, nom, c) in REGIONES.items():
            if key == 'cayos': continue
            r = 0.085 if key != 'vicecity' else 0.06
            d.ellipse(((x - r) * S, (y - r * 0.8) * S, (x + r) * S, (y + r * 0.8) * S), fill=mixc((18, 60, 70), c, 0.45))
        # carreteras
        rt = [REGIONES[k][:2] for k in ('portgellhorn', 'kalaga', 'ambrosia', 'grassrivers', 'vicecity')]
        d.line([(x * S, y * S) for x, y in rt], fill=ROSA, width=int(5 * k), joint='curve')
        d.line([(REGIONES['vicecity'][0] * S, REGIONES['vicecity'][1] * S), (0.70 * S, 0.80 * S), (CAYOS[0][0] * S, CAYOS[0][1] * S)], fill=ROSA, width=int(5 * k))
        # vice city: cuadrícula de calles
        vx, vy = REGIONES['vicecity'][:2]
        for i in range(-3, 4):
            d.line([((vx - 0.04) * S, (vy + i * 0.01) * S), ((vx + 0.03) * S, (vy + i * 0.01) * S)], fill=(255, 150, 200), width=int(2 * k))
            d.line([((vx + i * 0.01) * S, (vy - 0.035) * S), ((vx + i * 0.01) * S, (vy + 0.035) * S)], fill=(255, 150, 200), width=int(2 * k))
    im = ss(MS, MS, dr, k=1)
    glow = im.filter(ImageFilter.GaussianBlur(10))
    out = Image.new('RGBA', im.size, (0, 0, 0, 0)); out.alpha_composite(glow); out.alpha_composite(im)
    _TC['mapa'] = out
    return out


# ---------------------------------------------------------------- escenas
def centro():
    return W / 2, (H * 0.40 if not V else H * 0.38)


def entrada(ts, d=0.35): return back(cl(ts / d))


def e_titulo(fr, e, ts):
    cx, cy = centro()
    size = e.get('size', 92 if not V else 80)
    spr = texto(e['txt'], size, maxw=W * 0.86, upper=True, stroke=0.11)
    k = entrada(ts, 0.3)
    put(fr, spr, cx, cy - (30 if e.get('sub') else 0), sc=0.5 + 0.5 * k, a=cl(ts / 0.15))
    if e.get('sub'):
        t2 = e.get('tsub', 0.5)
        if ts > t2:
            put(fr, caja(e['sub'], 34), cx, cy + spr.height / 2 + 10, sc=entrada(ts - t2, 0.25))
    if e.get('icono'):
        ic = icono_spr(e['icono'], 150)
        put(fr, ic, cx, cy - spr.height / 2 - 90, sc=entrada(ts - 0.1), a=1)


def e_icono(fr, e, ts):
    cx, cy = centro()
    size = e.get('size', 250)
    bob = 6 * math.sin(ts * 3)
    put(fr, disco_fondo(int(size * 0.72), mixc(e.get('color', MORADO), NEGRO, 0.4), e.get('color2', CIAN)), cx, cy - 20, sc=entrada(ts, 0.3))
    ic = icono_spr(e['icono'], size)
    put(fr, ic, cx, cy - 20 + bob, sc=entrada(ts - 0.06, 0.35))
    if 'tachado' in e and ts > e['tachado']:
        put(fr, tachon(int(size * 0.95)), cx, cy - 20, sc=entrada(ts - e['tachado'], 0.2))
    if e.get('txt'):
        put(fr, caja(e['txt'], 40), cx, cy + size * 0.62, sc=entrada(ts - 0.2, 0.3))


def fila(n, w_item, y=None, max_w=None):
    cx, cy = centro(); y = cy if y is None else y
    max_w = max_w or W * 0.92
    if V and n > 2:
        cols = 2; rows = math.ceil(n / 2); gap = min(w_item * 1.2, max_w / 2)
        out = []
        for i in range(n):
            r, c = divmod(i, cols); cnt = min(cols, n - r * cols)
            out.append((cx + (c - (cnt - 1) / 2) * gap, y + (r - (rows - 1) / 2) * w_item * 1.45))
        return out, gap / (w_item * 1.2)
    gap = min(w_item * 1.25, max_w / n)
    return [(cx + (i - (n - 1) / 2) * gap, y) for i in range(n)], gap / (w_item * 1.25)


def e_iconos(fr, e, ts):
    items = e['items']; n = len(items)
    base = 170 if n <= 3 else 140
    pos, f = fila(n, base * 1.25)
    sz = int(base * min(1, f))
    for (x, y), it in zip(pos, items):
        tt = ts - it.get('t', 0)
        if tt < 0: continue
        put(fr, disco_fondo(int(sz * 0.66), (40, 14, 70), [ROSA, CIAN, AMAR, VERDE][items.index(it) % 4]), x, y - 10, sc=entrada(tt))
        put(fr, icono_spr(it['icono'], sz), x, y - 10 + 4 * math.sin(ts * 3 + x), sc=entrada(tt - 0.05))
        if it.get('tachado') is not None and ts > it['tachado']:
            put(fr, tachon(int(sz * 0.9)), x, y - 10, sc=entrada(ts - it['tachado'], 0.2))
        if it.get('txt'):
            put(fr, caja(it['txt'], 28 if n > 3 else 32), x, y + sz * 0.62, sc=entrada(tt - 0.15, 0.25))


def fmt_num(v, miles=True, dec=0):
    if dec:
        return f'{v:,.{dec}f}'  # dólares: formato 79.99
    s = f'{int(round(v)):,}'
    return s.replace(',', '.') if miles else s


def e_contador(fr, e, ts):
    cx, cy = centro()
    dur = e.get('dur', 1.8)
    q = eo(cl(ts / dur))
    v = lerp(e.get('desde', 0), e['hasta'], q)
    s = e.get('prefijo', '') + fmt_num(v, dec=e.get('dec', 0)) + e.get('sufijo', '')
    size = e.get('size', 140 if not V else 104)
    f = fnt(F_BLACK, size)
    spr = texto(s, size, fill=AMAR, stroke=0.09)
    pop = 1 + 0.08 * math.exp(-max(0, ts - dur) * 8) * (1 if ts > dur else 0)
    put(fr, spr, cx, cy - 10, sc=entrada(ts, 0.3) * pop)
    # anillo de progreso
    R = int(spr.height * 0.2)
    if e.get('icono'):
        put(fr, icono_spr(e['icono'], 130), cx, cy - spr.height / 2 - 70, sc=entrada(ts - 0.1))
    if e.get('txt'):
        put(fr, caja(e['txt'], 40), cx, cy + spr.height / 2 + 20, sc=entrada(ts - 0.25, 0.3))


MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
def calendario(mes, dia, anio, w=300):
    key = ('cal', mes, dia, anio, w)
    if key in _TC: return _TC[key]
    h = int(w * 1.12)
    def dr(d, k, im):
        d.rounded_rectangle((0, 0, w * k - 1, h * k - 1), radius=int(22 * k), fill=BLANCO, outline=NEGRO, width=int(6 * k))
        d.rounded_rectangle((3 * k, 3 * k, w * k - 3 * k, h * 0.28 * k), radius=int(20 * k), fill=ROJO)
        d.rectangle((3 * k, h * 0.18 * k, w * k - 3 * k, h * 0.28 * k), fill=ROJO)
        d.text((w * k / 2, h * 0.145 * k), mes, font=fnt(F_BLACK, w * 0.17 * k), fill=BLANCO, anchor='mm')
        d.text((w * k / 2, h * 0.58 * k), str(dia), font=fnt(F_BLACK, w * (0.42 if len(str(dia)) <= 2 else 0.25) * k), fill=NEGRO, anchor='mm')
        d.text((w * k / 2, h * 0.88 * k), str(anio), font=fnt(F_BLACK, w * 0.15 * k), fill=(90, 90, 110), anchor='mm')
    _TC[key] = ss(w, h, dr, k=2)
    return _TC[key]


def sello(txt, size=46, col=VERDE):
    key = ('sello', txt, size, col)
    if key in _TC: return _TC[key]
    f = fnt(F_BLACK, size); tw = f.getlength(txt) + size * 1.2; th = size * 1.7
    im = Image.new('RGBA', (int(tw), int(th)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((3, 3, tw - 4, th - 4), radius=10, outline=col, width=7)
    d.text((tw / 2, th / 2), txt, font=f, fill=col, anchor='mm', stroke_width=2, stroke_fill=NEGRO)
    im = im.rotate(-12, expand=True, resample=Image.BICUBIC)
    _TC[key] = im
    return im


def e_fecha(fr, e, ts):
    cx, cy = centro()
    cal = calendario(e.get('mes', ''), e.get('dia', ''), e.get('anio', ''), 300 if not V else 280)
    k = eo(cl(ts / 0.35))
    sp = cal.resize((cal.width, max(1, int(cal.height * k))), Image.BILINEAR) if k < 1 else cal
    put(fr, sp, cx, cy - 10, sc=1)
    if 'tachado' in e and ts > e['tachado']:
        put(fr, tachon(int(cal.width * 0.9)), cx, cy - 10, sc=entrada(ts - e['tachado'], 0.2))
    if 'sello' in e and ts > e.get('tsello', 1.0):
        q = cl((ts - e.get('tsello', 1.0)) / 0.18)
        put(fr, sello(e['sello'], 50, tuple(e.get('colorSello', VERDE))), cx + cal.width * 0.35, cy + cal.height * 0.25, sc=lerp(2.2, 1, q), a=q)
    if e.get('txt'):
        put(fr, caja(e['txt'], 40), cx, cy + cal.height / 2 + 34, sc=entrada(ts - 0.3, 0.3))


def e_linea_tiempo(fr, e, ts):
    cx, cy = centro(); d = ImageDraw.Draw(fr)
    hitos = e['hitos']; n = len(hitos)
    x0, x1 = W * 0.1, W * 0.9
    q = eo(cl(ts / 0.6))
    d.line([(x0, cy), (lerp(x0, x1, q), cy)], fill=NEGRO, width=14)
    d.line([(x0, cy), (lerp(x0, x1, q), cy)], fill=CIAN, width=8)
    for i, h in enumerate(hitos):
        x = lerp(x0, x1, (i + 0.5) / n); tt = ts - h.get('t', 0)
        if tt < 0: continue
        k = entrada(tt, 0.3); r = 16 * k
        d.ellipse((x - r - 4, cy - r - 4, x + r + 4, cy + r + 4), fill=NEGRO); d.ellipse((x - r, cy - r, x + r, cy + r), fill=AMAR if not h.get('rojo') else ROJO)
        put(fr, texto(str(h['anio']), 58 if not V else 44 if n > 3 else 50, fill=AMAR if not h.get('rojo') else ROJO, upper=True, stroke=0.12), x, cy - 62, sc=k)
        if h.get('txt'):
            put(fr, texto(h['txt'], 30 if not V else 24, maxw=(x1 - x0) / n * 0.95, upper=True, stroke=0.14), x, cy + 64, sc=k, ay=0.3)
        if h.get('tachado') is not None and ts > h['tachado']:
            put(fr, tachon(110 if not V else 90), x, cy - 62, sc=entrada(ts - h['tachado'], 0.2))


def e_mapa(fr, e, ts):
    m = mapa_spr()
    cx, cy = W / 2, (H * 0.44 if not V else H * 0.40)
    disp = min(W * 0.95, H * 0.86) if not V else W * 1.05
    def vista(f):
        if not f or f == 'todo': return (0.45, 0.50, 1.0)
        x, y = REGIONES[f][:2]; return (x, y, e.get('zoom', 2.3))
    a0 = vista(e.get('desde', e.get('foco'))); a1 = vista(e.get('foco'))
    q = eo(cl((ts - 0.05) / 0.9))
    vx, vy, z = lerp(a0[0], a1[0], q), lerp(a0[1], a1[1], q), lerp(a0[2], a1[2], q)
    z *= 1 + 0.02 * ts  # deriva lenta (cero cuadros quietos)
    side = MS / z
    x0 = vx * MS - side / 2; y0 = vy * MS - side / 2
    out = int(disp)
    crop = m.crop((int(x0), int(y0), int(x0 + side), int(y0 + side))).resize((out, out), Image.BILINEAR)
    rv = e.get('revelar')
    if rv:
        k = cl(ts / rv)
        if k < 1:
            mask = Image.new('L', crop.size, 0); ImageDraw.Draw(mask).rectangle((0, 0, out, int(out * k)), fill=255)
            a = np.minimum(np.array(crop.getchannel('A')), np.array(mask)); crop.putalpha(Image.fromarray(a))
    put(fr, crop, cx, cy)
    def scr(px, py):
        return cx + (px * MS - (x0 + side / 2)) / side * out, cy + (py * MS - (y0 + side / 2)) / side * out
    d = ImageDraw.Draw(fr)
    focos = e.get('marcar') or ([e['foco']] if e.get('foco') and e['foco'] != 'todo' else [])
    for i, key in enumerate(focos):
        tt = ts - 0.5 - i * e.get('paso', 0.25)
        if tt < 0: continue
        x, y, nom, c = REGIONES[key]; sx, sy = scr(x, y)
        for j in range(2):
            r = ((tt * 50 + j * 35) % 70) + 10
            d.ellipse((sx - r, sy - r, sx + r, sy + r), outline=c, width=4)
        put(fr, icono_spr('pin', 70), sx, sy, sc=entrada(tt, 0.3), ay=0.95)
        lbl = caja(nom, 32 if len(focos) == 1 else 22, bg=AMAR)
        put(fr, lbl, sx, sy + 26, sc=entrada(tt - 0.1, 0.3), ay=0)
    if e.get('titulo'):
        tt = ts - e.get('ttitulo', 0.3)
        if tt > 0:
            put(fr, texto(e['titulo'], 96 if not V else 80, maxw=W * 0.9, upper=True, stroke=0.1), W / 2, H * (0.16 if not V else 0.13), sc=0.5 + 0.5 * entrada(tt, 0.3))


def ficha_panel(w, h, col):
    key = ('panel', w, h, col)
    if key not in _TC:
        def dr(d, k, im):
            d.rounded_rectangle((0, 0, w * k - 1, h * k - 1), radius=int(26 * k), fill=(12, 8, 26, 235), outline=NEGRO, width=int(10 * k))
            d.rounded_rectangle((5 * k, 5 * k, w * k - 5 * k, h * k - 5 * k), radius=int(22 * k), outline=col, width=int(5 * k))
            for i in range(0, int(h * k), int(8 * k)): d.line([(8 * k, i), (w * k - 8 * k, i)], fill=(255, 255, 255, 10), width=k)
        _TC[key] = ss(w, h, dr)
    return _TC[key]


def e_ficha(fr, e, ts):
    col = tuple(e.get('color', CIAN))
    k = eo(cl(ts / 0.3))
    if not V:
        w, h = int(W * 0.82), int(H * 0.5)
        cx = W / 2 + (1 - k) * W * 0.6; cy = H * 0.38
        put(fr, ficha_panel(w, h, col), cx, cy)
        sx = cx - w / 2 + h * 0.52
        put(fr, disco_fondo(int(h * 0.4), mixc(col, NEGRO, 0.6), col), sx, cy)
        sil = silueta(e.get('silueta', 'hombre'), int(h * 0.74), col, e.get('extra'))
        put(fr, sil, sx, cy - 4 + 3 * math.sin(ts * 2.5))
        tx = sx + h * 0.5
        put(fr, texto(e['nombre'], 64, maxw=w - h * 1.1, upper=True, stroke=0.1, align='l'), tx, cy - h * 0.2, ax=0, sc=1, a=cl((ts - 0.15) / 0.15))
        if e.get('rol') and ts > 0.35:
            put(fr, caja(e['rol'], 34, bg=col), tx + 4, cy + 4, ax=0, sc=entrada(ts - 0.35, 0.25))
        for i, dd in enumerate(e.get('datos', [])):
            tt = ts - dd['t']
            if tt > 0:
                put(fr, texto(dd['txt'], 30, maxw=w - h * 1.1, upper=True, stroke=0.12, align='l'), tx, cy + h * 0.17 + i * 40, ax=0, sc=entrada(tt, 0.25))
    else:
        w, h = int(W * 0.9), int(H * 0.5)
        cx = W / 2 + (1 - k) * W; cy = H * 0.38
        put(fr, ficha_panel(w, h, col), cx, cy)
        sy = cy - h * 0.18
        put(fr, disco_fondo(int(w * 0.26), mixc(col, NEGRO, 0.6), col), cx, sy)
        put(fr, silueta(e.get('silueta', 'hombre'), int(w * 0.46), col, e.get('extra')), cx, sy - 4)
        put(fr, texto(e['nombre'], 56, maxw=w * 0.9, upper=True, stroke=0.1), cx, cy + h * 0.16)
        if e.get('rol') and ts > 0.35:
            put(fr, caja(e['rol'], 30, bg=col), cx, cy + h * 0.3, sc=entrada(ts - 0.35, 0.25))


def e_pareja(fr, e, ts):
    cx, cy = centro()
    sz = 300 if not V else 280
    gap = (W * 0.22) if not V else W * 0.24
    for i, (tipo, nom, col) in enumerate([('mujer', e.get('a', 'LUCIA'), ROSA), ('hombre', e.get('b', 'JASON'), CIAN)]):
        tt = ts - i * 0.15
        x = cx + (-1 if i == 0 else 1) * gap * (0.6 + 0.4 * eo(cl(tt / 0.4)))
        put(fr, disco_fondo(int(sz * 0.42), mixc(col, NEGRO, 0.6), col), x, cy - 20, sc=entrada(tt))
        put(fr, silueta(tipo, sz, col, e.get('extra')), x, cy - 24 + 3 * math.sin(ts * 2 + i), sc=entrada(tt))
        put(fr, caja(nom, 36, bg=col), x, cy + sz * 0.45, sc=entrada(tt - 0.2, 0.25))
    mid = e.get('medio', 'rayo')
    if ts > 0.4:
        if mid == 'rayo': put(fr, icono_spr('pelea', 120), cx, cy - 20, sc=entrada(ts - 0.4) * (1 + 0.05 * math.sin(ts * 8)))
        elif mid == 'pregunta': put(fr, icono_spr('pregunta', 120, ROJO), cx, cy - 20, sc=entrada(ts - 0.4))
        elif mid == 'corazon': put(fr, icono_spr('corazon', 120), cx, cy - 20, sc=entrada(ts - 0.4) * (1 + 0.08 * abs(math.sin(ts * 5))))
    if e.get('txt') and ts > 0.6:
        put(fr, texto(e['txt'], 64 if not V else 54, maxw=W * 0.9, upper=True, stroke=0.11), W / 2, H * (0.12 if not V else 0.13), sc=entrada(ts - 0.6, 0.3))


def e_galeria(fr, e, ts):
    items = e['items']; n = len(items)
    cols = n if (not V and n <= 7) else (3 if V else 4)
    rows = math.ceil(n / cols)
    cx, cy = centro()
    cw = min(W * 0.9 / cols, 200 if not V else 220); sz = int(cw * 1.0)
    pal = [ROSA, CIAN, AMAR, VERDE, NARANJA, MORADO, ROJO]
    for i, it in enumerate(items):
        r, c = divmod(i, cols); cnt = min(cols, n - r * cols)
        x = cx + (c - (cnt - 1) / 2) * cw; y = cy + (r - (rows - 1) / 2) * sz * 1.25
        tt = ts - it.get('t', i * e.get('paso', 0.18))
        if tt < 0: continue
        col = pal[i % len(pal)]
        put(fr, silueta(it.get('silueta', 'hombre'), sz, col, 'pregunta' if (e.get('preguntas') is not None and ts > e['preguntas']) else None), x, y + 3 * math.sin(ts * 2 + i), sc=entrada(tt))
        if it.get('txt'):
            put(fr, caja(it['txt'], 20 if not V else 22, bg=col), x, y + sz * 0.5, sc=entrada(tt - 0.1, 0.25))
    if e.get('txt'):
        put(fr, texto(e['txt'], 64 if not V else 54, maxw=W * 0.9, upper=True, stroke=0.11), W / 2, H * (0.1 if not V else 0.14), sc=entrada(ts - 0.3, 0.3))


def telefono_spr(w, h):
    key = ('tel', w, h)
    if key not in _TC:
        def dr(d, k, im):
            d.rounded_rectangle((0, 0, w * k - 1, h * k - 1), radius=int(w * 0.14 * k), fill=(10, 10, 14), outline=NEGRO, width=int(6 * k))
            d.rounded_rectangle((4 * k, 4 * k, w * k - 4 * k, h * k - 4 * k), radius=int(w * 0.13 * k), outline=(90, 90, 110), width=int(3 * k))
            sx0, sy0, sx1, sy1 = int(w * 0.06 * k), int(h * 0.05 * k), int(w * 0.94 * k), int(h * 0.95 * k)
            d.rounded_rectangle((sx0, sy0, sx1, sy1), radius=int(w * 0.08 * k), fill=(0, 0, 0, 0))
            d.rounded_rectangle((w * 0.38 * k, h * 0.02 * k, w * 0.62 * k, h * 0.04 * k), radius=int(4 * k), fill=(30, 30, 40))
        im = ss(w, h, dr)
        _TC[key] = im
    return _TC[key]


def figura_pal(d, x, y, s, col, t, ph=0.0, arma=None, correr=True):
    """Muñeco de palo estilizado (silueta propia)."""
    b = math.sin(t * 14 + ph) if correr else 0
    w = max(2, int(s * 0.12))
    d.ellipse((x - s * 0.13, y - s, x + s * 0.13, y - s * 0.74), fill=col)
    d.line([(x, y - s * 0.74), (x, y - s * 0.36)], fill=col, width=w)
    d.line([(x, y - s * 0.36), (x + s * 0.22 * b, y)], fill=col, width=w)
    d.line([(x, y - s * 0.36), (x - s * 0.22 * b, y)], fill=col, width=w)
    hx, hy = x + s * 0.3, y - s * 0.62 - s * 0.12 * b
    d.line([(x, y - s * 0.66), (hx, hy)], fill=col, width=w)
    d.line([(x, y - s * 0.66), (x - s * 0.26, y - s * 0.5 + s * 0.12 * b)], fill=col, width=w)
    if arma == 'martillo':
        d.line([(hx, hy), (hx + s * 0.05, hy - s * 0.32)], fill=(150, 90, 40), width=w)
        d.rectangle((hx - s * 0.1, hy - s * 0.42, hx + s * 0.2, hy - s * 0.3), fill=(200, 205, 215))


def pantalla(variante, w, h, t, rnd_seed=0):
    im = Image.new('RGBA', (w, h), (0, 0, 0, 255)); d = ImageDraw.Draw(im)
    if variante in ('martillo', 'pelea', 'caiman', 'fiesta'):
        sky = {'martillo': ((40, 120, 200), (250, 190, 120)), 'pelea': ((30, 30, 80), (200, 80, 120)),
               'caiman': ((80, 170, 220), (220, 240, 200)), 'fiesta': ((255, 120, 60), (255, 220, 120))}[variante]
        g = grad(sky[0], sky[1], w, int(h * 0.62)); im.paste(g, (0, 0))
        gy = int(h * 0.62)
        d.rectangle((0, gy, w, h), fill=(70, 70, 80) if variante in ('martillo', 'pelea') else (230, 210, 150))
        if variante in ('martillo', 'pelea'):
            for i in range(6):
                x = ((i * 60 - t * 120) % (w + 60)) - 30; d.rectangle((x, gy + h * 0.17, x + 30, gy + h * 0.17 + 6), fill=BLANCO)
            for i in range(4):
                bx = ((i * w * 0.4 - t * 30) % (w * 1.6)) - w * 0.3; bh = h * (0.2 + 0.1 * (i % 2))
                d.rectangle((bx, gy - bh, bx + w * 0.3, gy), fill=(60, 50, 90))
        else:
            d.rectangle((0, gy - 10, w, gy + 6), fill=(40, 160, 200))
        s = h * 0.3
        if variante == 'martillo':
            px = w * 0.5 + w * 0.12 * math.sin(t * 1.3)
            figura_pal(d, px + w * 0.22, h * 0.86, s, (30, 30, 40), t, 0)
            figura_pal(d, px - w * 0.12, h * 0.86, s, (220, 40, 80), t, 1.5, arma='martillo')
        elif variante == 'pelea':
            for i, c in enumerate([(30, 30, 40), (40, 40, 160)]):
                figura_pal(d, w * (0.38 + 0.24 * i) + 6 * math.sin(t * 12 + i), h * 0.86, s, c, t, i * 3, correr=True)
            d.polygon([(w * 0.5, h * 0.4), (w * 0.56, h * 0.5), (w * 0.5, h * 0.48), (w * 0.53, h * 0.58)], fill=AMAR)
        elif variante == 'caiman':
            figura_pal(d, w * 0.32, h * 0.86, s, (30, 30, 40), t, 0, correr=False)
            cx = w * 0.62 + 6 * math.sin(t * 3)
            d.polygon([(cx - w * 0.2, h * 0.84), (cx, h * 0.76), (cx + w * 0.26, h * 0.8), (cx, h * 0.86)], fill=(70, 150, 60))
            d.ellipse((cx + w * 0.16, h * 0.775, cx + w * 0.19, h * 0.795), fill=AMAR)
        elif variante == 'fiesta':
            for i in range(5):
                figura_pal(d, w * (0.14 + 0.18 * i), h * 0.86 - 12 * abs(math.sin(t * 6 + i)), s * 0.8, [ROSA, (30, 30, 40), CIAN, (30, 30, 40), MORADO][i], t, i, correr=False)
            rr = random.Random(rnd_seed)
            for i in range(30):
                x = rr.uniform(0, w); y = (rr.uniform(0, h) + t * 120) % h
                d.rectangle((x, y, x + 6, y + 6), fill=[AMAR, ROSA, CIAN, VERDE][i % 4])
    elif variante == 'cuenta':
        d.rectangle((0, 0, w, h), fill=(18, 18, 24))
        d.ellipse((w * 0.3, h * 0.12, w * 0.7, h * 0.12 + w * 0.4), fill=(60, 60, 80), outline=ROSA, width=4)
        d.rounded_rectangle((w * 0.15, h * 0.48, w * 0.85, h * 0.56), radius=8, fill=ROSA)
        for i in range(6):
            x = w * (0.08 + (i % 3) * 0.3); y = h * (0.62 + (i // 3) * 0.17)
            d.rectangle((x, y, x + w * 0.26, y + h * 0.15), fill=(50, 50, 70))
    # interfaz tipo red social genérica
    if (t * 2) % 2 < 1.3: d.ellipse((14, 18, 30, 34), fill=ROJO)
    d.text((36, 16), 'REC', font=fnt(F_BLACK, 18), fill=BLANCO, stroke_width=2, stroke_fill=NEGRO)
    for i, ic in enumerate(['corazon', 'comentario', 'compartir']):
        put_local(im, icono_spr(ic, 40), w - 34, h * 0.5 + i * 56)
    return im


def put_local(base, spr, cx, cy):
    base.alpha_composite(spr, (int(cx - spr.width / 2), int(cy - spr.height / 2)))


def e_telefono(fr, e, ts):
    cx, cy = centro()
    vars_ = e.get('variantes') or [e.get('variante', 'martillo')]
    n = len(vars_)
    h = int(H * (0.66 if not V else 0.5)) if n == 1 else int(H * (0.56 if not V else 0.34))
    w = int(h * 0.5)
    gap = min(w * 1.25, W * 0.92 / n)
    for i, v in enumerate(vars_):
        tt = ts - i * 0.2
        if tt < 0: continue
        x = cx + (i - (n - 1) / 2) * gap
        y = cy + (1 - eo(cl(tt / 0.35))) * H * 0.6 - (10 if not V else 0)
        scr = pantalla(v, int(w * 0.88), int(h * 0.9), ts, i)
        msk = Image.new('L', scr.size, 0); ImageDraw.Draw(msk).rounded_rectangle((0, 0, scr.width - 1, scr.height - 1), radius=int(w * 0.08), fill=255)
        scr.putalpha(msk)
        tel = telefono_spr(w, h).copy(); tel.alpha_composite(scr, (int(w * 0.06), int(h * 0.05)))
        rot = e.get('rot', [0, -4, 4][i % 3] if n > 1 else -3)
        if rot: tel = tel.rotate(rot, expand=True, resample=Image.BILINEAR)
        put(fr, tel, x, y)
    if e.get('txt'):
        put(fr, caja(e['txt'], 40), W / 2, cy + h * 0.5 + (10 if not V else 40), sc=entrada(ts - 0.3, 0.3))
    if e.get('etiquetas'):
        for i, lb in enumerate(e['etiquetas']):
            if ts > 0.4 + i * 0.2:
                x = cx + (i - (n - 1) / 2) * gap
                put(fr, caja(lb, 30, bg=[ROSA, CIAN, AMAR][i % 3]), x, cy - h * 0.5 - 6, sc=entrada(ts - 0.4 - i * 0.2, 0.25))


def etiqueta_precio(txt, sub, w=300, col=AMAR):
    key = ('precio', txt, sub, w, col)
    if key in _TC: return _TC[key]
    h = int(w * 0.62)
    def dr(d, k, im):
        pts = [(0.18 * w * k, 0), (w * k - 1, 0), (w * k - 1, h * k - 1), (0.18 * w * k, h * k - 1), (0, h * k / 2)]
        d.polygon(pts, fill=col, outline=NEGRO, width=int(7 * k))
        d.ellipse((0.07 * w * k, h * k / 2 - 9 * k, 0.07 * w * k + 18 * k, h * k / 2 + 9 * k), fill=BLANCO, outline=NEGRO, width=int(4 * k))
        d.text((0.6 * w * k, h * 0.42 * k), txt, font=fnt(F_BLACK, w * 0.22 * k), fill=NEGRO, anchor='mm')
        d.text((0.6 * w * k, h * 0.78 * k), sub, font=fnt(F_CN, w * 0.11 * k), fill=NEGRO, anchor='mm')
    _TC[key] = ss(w, h, dr)
    return _TC[key]


def e_precio(fr, e, ts):
    cx, cy = centro()
    items = e['items']; n = len(items)
    w = 340 if n == 1 else (320 if not V else 300)
    for i, it in enumerate(items):
        tt = ts - it.get('t', 0)
        if tt < 0: continue
        if V: x, y = cx, cy + (i - (n - 1) / 2) * w * 0.75
        else: x, y = cx + (i - (n - 1) / 2) * w * 1.2, cy
        spr = etiqueta_precio(it['txt'], it.get('sub', ''), w, tuple(it.get('color', AMAR)))
        ang = 6 * math.sin(ts * 2.2 + i) * math.exp(-tt * 0.3) + 2 * math.sin(ts * 1.5 + i)
        put(fr, spr.rotate(ang, expand=True, resample=Image.BILINEAR), x, y, sc=entrada(tt))
    if e.get('txt'):
        put(fr, caja(e['txt'], 40), W / 2, H * (0.12 if not V else 0.16), sc=entrada(ts - 0.3, 0.3))


def e_barras(fr, e, ts):
    cx, cy = centro(); d = ImageDraw.Draw(fr)
    items = e['barras']; n = len(items); mx = e.get('max') or max(b['valor'] for b in items)
    bw = W * (0.6 if not V else 0.7); bh = 64; x0 = cx - bw / 2 + (60 if not V else 0)
    for i, b in enumerate(items):
        y = cy + (i - (n - 1) / 2) * (bh + 70)
        tt = ts - b.get('t', i * 0.4)
        if tt < 0: continue
        q = eo(cl(tt / 0.8)); L = bw * b['valor'] / mx * q
        col = tuple(b.get('color', [CIAN, AMAR, ROSA][i % 3]))
        d.rounded_rectangle((x0 - 4, y - bh / 2 - 4, x0 + L + 4, y + bh / 2 + 4), radius=14, fill=NEGRO)
        d.rounded_rectangle((x0, y - bh / 2, x0 + max(L, 8), y + bh / 2), radius=10, fill=col)
        put(fr, texto(b['etiqueta'], 30, upper=True, stroke=0.14, align='l'), x0, y - bh / 2 - 8, ax=0, ay=1)
        put(fr, texto(b.get('prefijo', '') + fmt_num(b['valor'] * q, dec=b.get('dec', 0)) + b.get('sufijo', ''), 44, upper=True, stroke=0.12, align='l'), x0 + L + 16, y, ax=0)
    if e.get('txt') and ts > e.get('ttxt', 1.2):
        put(fr, sello(e['txt'], 56, AMAR), cx + bw * 0.3, cy - 150 if not V else cy - 200, sc=lerp(2, 1, cl((ts - e.get('ttxt', 1.2)) / 0.18)))


def e_descarga(fr, e, ts):
    cx, cy = centro(); d = ImageDraw.Draw(fr)
    put(fr, icono_spr(e.get('icono', 'mando'), 200), cx, cy - 110, sc=entrada(ts))
    bw = W * (0.6 if not V else 0.8); bh = 50; x0 = cx - bw / 2; y = cy + 40
    q = eo(cl((ts - 0.2) / e.get('dur', 3.0)))
    d.rounded_rectangle((x0 - 6, y - 6, x0 + bw + 6, y + bh + 6), radius=18, fill=NEGRO)
    d.rounded_rectangle((x0, y, x0 + bw, y + bh), radius=14, fill=(40, 40, 60))
    if q > 0.01: d.rounded_rectangle((x0, y, x0 + bw * q, y + bh), radius=14, fill=VERDE)
    put(fr, texto(f'{int(q * 100)}%', 48, stroke=0.12), cx, y + bh / 2)
    if e.get('txt'):
        put(fr, caja(e['txt'], 38), cx, y + bh + 60, sc=entrada(ts - 0.3, 0.3))


def e_compartir(fr, e, ts):
    cx, cy = centro()
    gap = W * (0.2 if not V else 0.26)
    for i, ic in enumerate(['compartir', 'seguir']):
        tt = ts - i * e.get('t2', 1.2)
        if tt < 0: continue
        x = cx + (-1 if i == 0 else 1) * gap
        put(fr, disco_fondo(130, (40, 14, 70), [CIAN, VERDE][i]), x, cy - 20, sc=entrada(tt))
        put(fr, icono_spr(ic, 190), x, cy - 20 + 6 * math.sin(ts * 3 + i), sc=entrada(tt - 0.05) * (1 + 0.06 * abs(math.sin(ts * 4))))
        put(fr, caja(['COMPARTE', 'SÍGUENOS'][i], 44, bg=[CIAN, VERDE][i]), x, cy + 150, sc=entrada(tt - 0.15, 0.25))


def e_cierre(fr, e, ts):
    cx, cy = centro()
    tc = e.get('tclick', 1.4)
    sub = ts > tc
    key = ('btn', sub)
    if key not in _TC:
        bw, bh = 520, 130
        def dr(d, k, im):
            d.rounded_rectangle((0, 0, bw * k - 1, bh * k - 1), radius=int(24 * k), fill=NEGRO)
            d.rounded_rectangle((6 * k, 6 * k, bw * k - 6 * k, bh * k - 6 * k), radius=int(20 * k), fill=(110, 110, 120) if sub else ROJO)
            d.text((bw * k / 2, bh * k / 2), 'SUSCRITO ✓' if sub else 'SUSCRÍBETE', font=fnt(F_BLACK, 56 * k), fill=BLANCO, anchor='mm')
        _TC[key] = ss(bw, bh, dr)
    btn = _TC[key]
    pres = 0.92 if abs(ts - tc) < 0.08 else 1
    bx = cx - (90 if not V else 0)
    put(fr, btn, bx, cy, sc=entrada(ts) * pres)
    # campana
    bxl = cx + (btn.width / 2 + 40 if not V else 0); byl = cy if not V else cy + 170
    if ts > tc + 0.3:
        ang = 25 * math.sin((ts - tc) * 18) * math.exp(-(ts - tc - 0.3) * 1.5)
        put(fr, icono_spr('campana', 140).rotate(ang, resample=Image.BICUBIC), bxl, byl, sc=entrada(ts - tc - 0.3))
    # cursor
    q = eo(cl((ts - 0.4) / (tc - 0.4)))
    px = lerp(W * 0.85, bx + 60, q); py = lerp(H * 0.9, cy + 20, q)
    d = ImageDraw.Draw(fr)
    pts = [(px, py), (px, py + 46), (px + 12, py + 34), (px + 22, py + 54), (px + 30, py + 50), (px + 20, py + 31), (px + 36, py + 30)]
    d.polygon(pts, fill=BLANCO, outline=NEGRO, width=4)
    if e.get('txt'):
        put(fr, texto(e['txt'], 60 if not V else 52, maxw=W * 0.9, upper=True, stroke=0.11), W / 2, H * (0.13 if not V else 0.16), sc=entrada(ts - 0.2, 0.3))


TIPOS = dict(titulo=e_titulo, icono=e_icono, iconos=e_iconos, contador=e_contador, fecha=e_fecha, linea_tiempo=e_linea_tiempo,
             mapa=e_mapa, ficha=e_ficha, pareja=e_pareja, galeria=e_galeria, telefono=e_telefono, precio=e_precio,
             barras=e_barras, descarga=e_descarga, compartir=e_compartir, cierre=e_cierre)


# ---------------------------------------------------------------- cuadro completo
class Escena:
    def __init__(self, data):
        self.d = data
        self.esc = sorted(data['escenas'], key=lambda e: e['inicio'])
        self.subs = sorted(data.get('subs', []), key=lambda s: s['ini'])
        self.starts = [e['inicio'] for e in self.esc]

    def escena_en(self, t):
        import bisect
        i = bisect.bisect_right(self.starts, t) - 1
        return self.esc[max(0, i)], max(0, i)

    def sub_en(self, t):
        for s in self.subs:
            if s['ini'] <= t < s['fin']: return s
        return None

    def cuadro(self, t):
        e, i = self.escena_en(t)
        ts = t - e['inicio']
        pal = e.get('paleta'); pal = tuple(tuple(c) for c in pal) if pal else None
        fr = FONDOS.get(e.get('fondo', 'grid'), bg_grid)(t, pal)
        if e.get('tipo') in TIPOS:
            TIPOS[e['tipo']](fr, e, ts)
        fr.alpha_composite(vineta())
        # transición: destello + barra amarilla diagonal
        if ts < 0.22 and i > 0:
            q = ts / 0.22
            d = ImageDraw.Draw(fr)
            x = lerp(-W * 0.3, W * 1.3, q)
            d.polygon([(x - 120, 0), (x + 40, 0), (x - 160 + 40, H), (x - 320, H)], fill=AMAR)
            d.polygon([(x - 180, 0), (x - 140, 0), (x - 300, H), (x - 340, H)], fill=ROSA)
        s = self.sub_en(t)
        if s:
            tt = t - s['ini']
            size = 50 if not V else 46
            spr = texto(s['txt'], size, maxw=W * (0.8 if not V else 0.88), stroke=0.17)
            k = 1.18 - 0.18 * eo(cl(tt / 0.12))
            put(fr, spr, W / 2, H * (0.85 if not V else 0.79), sc=k, a=cl(tt / 0.06))
        return fr


# ---------------------------------------------------------------- música synthwave propia
def musica(dur, sr=44100, bpm=96, seed=1):
    rng = np.random.default_rng(seed)
    beat = 60 / bpm; bar = beat * 4; loop_len = int(sr * bar * 4)
    t = np.arange(loop_len) / sr
    out = np.zeros(loop_len)
    def nota(m): return 440 * 2 ** ((m - 69) / 12)
    acordes = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]  # Am F C G
    def env(n, a, r):
        e = np.ones(n); na = int(a * sr); nr = int(r * sr)
        if na: e[:na] = np.linspace(0, 1, na)
        if nr: e[-nr:] *= np.linspace(1, 0, nr)
        return e
    def lp(x, a):
        y = np.zeros_like(x); acc = 0.0
        # filtro de un polo vectorizado aproximado por bloques
        from scipy.signal import lfilter
        return lfilter([a], [1, a - 1], x)
    for b in range(4):
        root = acordes[b][0]
        t0 = int(b * bar * sr); n = int(bar * sr); tt = np.arange(n) / sr
        pad = sum(np.sign(np.sin(2 * np.pi * nota(m) * tt * (1 + det))) * 0.5 + ((tt * nota(m) * (1 + det)) % 1 - 0.5)
                  for m in acordes[b] for det in (-0.004, 0.004))
        out[t0:t0 + n] += lp(pad, 0.04) * 0.05 * env(n, 0.3, 0.3)
        for k8 in range(8):  # bajo en corcheas
            s0 = t0 + int(k8 * beat / 2 * sr); nn = int(beat / 2 * sr * 0.9); tb = np.arange(nn) / sr
            f = nota(root - 12 + (12 if k8 % 2 else 0))
            saw = ((tb * f) % 1 - 0.5) * 2
            out[s0:s0 + nn] += lp(saw, 0.08) * 0.28 * np.exp(-tb * 5)
        for k16 in range(16):  # arpegio
            s0 = t0 + int(k16 * beat / 4 * sr); nn = int(beat / 4 * sr * 0.8); ta = np.arange(nn) / sr
            m = acordes[b][k16 % 3] + 12 * (1 + (k16 // 3) % 2)
            out[s0:s0 + nn] += np.sign(np.sin(2 * np.pi * nota(m) * ta)) * 0.035 * np.exp(-ta * 14)
    for k in range(16):  # batería
        s0 = int(k * beat * sr)
        n = int(0.35 * sr); tk = np.arange(n) / sr
        kick = np.sin(2 * np.pi * (45 * tk + 90 * (1 - np.exp(-tk * 30)) / 30)) * np.exp(-tk * 9)
        out[s0:s0 + n] += kick * 0.9
        if k % 2 == 1:
            ns = int(0.25 * sr); tsn = np.arange(ns) / sr
            sn = rng.standard_normal(ns) * np.exp(-tsn * 16) * 0.35 + np.sin(2 * np.pi * 190 * tsn) * np.exp(-tsn * 22) * 0.3
            out[s0:s0 + ns] += sn
        for hh in (0, 0.5):
            h0 = s0 + int(hh * beat * sr); nh = int(0.05 * sr)
            noise = rng.standard_normal(nh); noise = np.diff(noise, prepend=0)
            out[h0:h0 + nh] += noise * np.exp(-np.arange(nh) / sr * 60) * 0.08
    reps = int(math.ceil(dur * sr / loop_len)) + 1
    full = np.tile(out, reps)[:int(dur * sr)]
    fade = int(2 * sr); full[:fade] *= np.linspace(0, 1, fade); full[-fade:] *= np.linspace(1, 0, fade)
    full /= (np.max(np.abs(full)) + 1e-9)
    return full


def mezclar(voz, dur, salida, sr=44100):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voz, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    v = np.frombuffer(raw, np.float32).astype(np.float64)
    n = max(len(v), int(dur * sr))
    m = musica(n / sr, sr)[:n]
    vv = np.zeros(n); vv[:len(v)] = v
    rv = np.sqrt(np.mean(v[np.abs(v) > 0.01] ** 2)) if np.any(np.abs(v) > 0.01) else 0.1
    rm = np.sqrt(np.mean(m ** 2)) + 1e-9
    m *= rv * 10 ** (-20 / 20) / rm
    mix = vv + m
    mix /= max(1.0, np.max(np.abs(mix)) / 0.98)
    st = np.stack([mix, mix], 1).astype(np.float32)
    p_ = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-i', '-', salida], stdin=subprocess.PIPE)
    p_.stdin.write(st.tobytes()); p_.stdin.close(); p_.wait()


# ---------------------------------------------------------------- render
def trabajador(data, formato, fps, f0, f1, salida, OW_, OH_, crf):
    setup(formato)
    sc = Escena(data)
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                           '-vf', f'scale={OW_}:{OH_}:flags=lanczos', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(crf),
                           '-pix_fmt', 'yuv420p', salida], stdin=subprocess.PIPE)
    cartel = os.environ.get('GTA_CARTEL'); tfin = f1 / fps
    for f in range(f0, f1):
        im = sc.cuadro(f / fps)
        if cartel and tfin - f / fps < 3.0:
            q = cl((3.0 - (tfin - f / fps)) / 0.3)
            put(im, caja(cartel, 46, bg=AMAR), W / 2, H * 0.1, sc=back(q))
        ff.stdin.write(im.convert('RGB').tobytes())
        if (f - f0) % 300 == 0: print(f'  [{os.getpid()}] {f - f0}/{f1 - f0}', flush=True)
    ff.stdin.close(); ff.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('escenas')
    ap.add_argument('--formato', default='youtube', choices=['youtube', 'vertical'])
    ap.add_argument('--salida'); ap.add_argument('--audio')
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--desde', type=float, default=0); ap.add_argument('--hasta', type=float)
    ap.add_argument('--workers', type=int, default=2)
    ap.add_argument('--crf', type=int, default=19)
    ap.add_argument('--en', type=str)
    ap.add_argument('--solo_video', action='store_true')
    a = ap.parse_args()
    data = json.load(open(a.escenas, encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(a.escenas))
    setup(a.formato)
    dur = data['duracion']
    # control de huecos > 5 s sin cambio visual
    beats = []
    for e in data['escenas']:
        beats.append(e['inicio'])
        for k in ('items', 'hitos', 'datos', 'barras'):
            for j, it in enumerate(e.get(k, []) or []):
                if isinstance(it, dict) and 't' in it: beats.append(e['inicio'] + it['t'])
                elif e.get('tipo') == 'galeria' and k == 'items': beats.append(e['inicio'] + j * e.get('paso', 0.18))
        for k in ('tachado', 'tsello', 'tsub', 'tclick', 't2', 'preguntas', 'ttitulo'):
            if isinstance(e.get(k), (int, float)): beats.append(e['inicio'] + e[k])
    beats = sorted(set(beats)) + [dur]
    for x, y in zip(beats, beats[1:]):
        if y - x > 5.0: print(f'AVISO: {y - x:.1f} s sin cambio visual entre {x:.1f} y {y:.1f}')
    if a.en:
        sc = Escena(data)
        out = a.salida or os.path.join(base, f'cuadros_{a.formato}'); os.makedirs(out, exist_ok=True)
        for t in [float(x) for x in a.en.split(',')]:
            sc.cuadro(t).convert('RGB').save(os.path.join(out, f'{t:07.2f}.png'))
        print('cuadros en', out); return
    t0, t1 = a.desde, min(a.hasta or dur, dur)
    f0, f1 = int(round(t0 * a.fps)), int(round(t1 * a.fps))
    OW_, OH_ = (1920, 1080) if a.formato == 'youtube' else (1080, 1920)
    salida = a.salida or os.path.join(base, 'largo_youtube.mp4' if a.formato == 'youtube' else 'vertical.mp4')
    tmp = tempfile.mkdtemp(prefix='gta_')
    from multiprocessing import Process
    n = max(1, a.workers); paso = math.ceil((f1 - f0) / n); partes = []; procs = []
    for i in range(n):
        s0, s1 = f0 + i * paso, min(f1, f0 + (i + 1) * paso)
        if s0 >= s1: continue
        o = os.path.join(tmp, f'p{i}.mp4'); partes.append(o)
        pr = Process(target=trabajador, args=(data, a.formato, a.fps, s0, s1, o, OW_, OH_, a.crf)); pr.start(); procs.append(pr)
    for pr in procs: pr.join()
    lst = os.path.join(tmp, 'l.txt'); open(lst, 'w').write(''.join(f"file '{x}'\n" for x in partes))
    video = os.path.join(tmp, 'v.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', video], check=True)
    if a.solo_video:
        os.replace(video, salida); print('listo (sin audio):', salida); return
    audio = a.audio or os.path.join(base, 'audio.mp3')
    mezcla = os.path.join(base, 'mezcla.wav')
    if not os.path.exists(mezcla):
        mezclar(audio, dur, mezcla)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-ss', str(t0), '-t', str(t1 - t0), '-i', mezcla, '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida], check=True)
    print('listo:', salida, f'({t1 - t0:.1f} s)')


if __name__ == '__main__':
    main()
