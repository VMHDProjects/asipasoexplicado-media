/* Retratos ilustrados (bustos estilizados) generados por parámetros.
   Se definen una vez en escenas.json → "personajes" y se reutilizan entre episodios.
   Caja de dibujo: 400 × 500. */
(function () {
  const { U } = APE;

  const DEF = {
    piel: '#c08a5e', pelo: 'corto', colorPelo: '#1d1612', bigote: null, barba: null,
    ropa: 'levita', colorRopa: null, banda: false, sombrero: null, lentes: false,
    mirada: 0, cejas: 'normal', edad: 'adulto', colorManto: null,
  };

  APE.retrato = function (parent, ctx, def, opts = {}) {
    const p = Object.assign({}, DEF, def);
    const C = ctx.tema.colores;
    const ink = ctx.tema.tintaRetrato || '#160f14';
    const sw = 3.2;
    const piel = p.piel, sombra = U.oscuro(piel, 0.22), luz = U.claro(piel, 0.12);
    const root = U.el('g', {}, parent);
    const trazos = [];
    let destino = root;
    const S = (tag, a, par) => { const e = U.el(tag, Object.assign({ stroke: ink, 'stroke-width': sw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1 }, a), par || destino); trazos.push(e); return e; };
    const F = (tag, a, par) => U.el(tag, a, par || destino); // relleno sin trazo

    // pelo largo detrás
    if (p.pelo === 'largo' || p.sombrero === 'manto') {
      const col = p.sombrero === 'manto' ? (p.colorManto || C.manto || '#8a5a3a') : p.colorPelo;
      S('path', { d: 'M112 210 C 100 110 150 82 200 82 C 250 82 300 110 288 210 C 292 285 305 335 336 380 L 64 380 C 95 335 108 285 112 210 Z', fill: col });
    }

    // torso
    const torso = U.el('g', {}, root);
    const ropaCol = p.colorRopa || { militar: '#1e2a4a', levita: '#24201f', tunica: '#7a4b2e', bata: '#f2f2ee', camisa: '#3d5a80', vestido: '#2f5d8a' }[p.ropa] || '#333';
    S('path', { d: 'M22 500 C 30 410 100 368 158 352 L 242 352 C 300 368 370 410 378 500 Z', fill: ropaCol }, torso);
    F('path', { d: 'M22 500 C 30 410 100 368 158 352 L 175 352 C 120 380 90 430 84 500 Z', fill: '#000', opacity: 0.18 }, torso);
    if (p.ropa === 'militar') {
      F('path', { d: 'M200 360 L200 500', stroke: U.oscuro(ropaCol, 0.4), 'stroke-width': 4 }, torso);
      for (let y = 392; y < 500; y += 26) S('circle', { cx: 214, cy: y, r: 6, fill: C.dorado || '#e2b04a', 'stroke-width': 2 }, torso);
      [[64, 404, -14], [336, 404, 14]].forEach(([x, y, r]) => {
        const eg = U.el('g', { transform: `rotate(${r},${x},${y})` }, torso);
        S('rect', { x: x - 44, y: y - 13, width: 88, height: 24, rx: 12, fill: C.dorado || '#e2b04a' }, eg);
        for (let k = -38; k <= 38; k += 9) F('line', { x1: x + k, y1: y + 11, x2: x + k, y2: y + 30, stroke: C.dorado || '#e2b04a', 'stroke-width': 3.2 }, eg);
      });
      if (p.medallas) [[150, 430], [128, 438]].forEach(([x, y], k) => { F('rect', { x: x - 7, y: y - 26, width: 14, height: 18, fill: k ? '#c0392b' : '#2f5da8' }, torso); S('circle', { cx: x, cy: y, r: 9, fill: C.dorado || '#e2b04a', 'stroke-width': 2 }, torso); });
    }
    if (p.ropa === 'levita') {
      S('path', { d: 'M168 354 L200 440 L232 354 Z', fill: '#f1ece2' }, torso);
      S('path', { d: 'M158 352 L200 446 L150 500 L110 500 Z', fill: U.oscuro(ropaCol, 0.25) }, torso);
      S('path', { d: 'M242 352 L200 446 L250 500 L290 500 Z', fill: U.oscuro(ropaCol, 0.25) }, torso);
      S('path', { d: 'M182 362 L200 372 L218 362 L218 382 L200 374 L182 382 Z', fill: p.corbata || '#111' }, torso);
    }
    if (p.ropa === 'tunica') {
      S('path', { d: 'M160 352 L200 420 L240 352', fill: U.claro(ropaCol, 0.15) }, torso);
      S('path', { d: 'M250 356 C 300 372 345 410 360 500 L 255 500 C 245 440 220 400 190 372 Z', fill: p.colorManto || C.manto || '#c9a46a' }, torso);
      F('path', { d: 'M150 380 C 170 420 175 460 172 500', stroke: U.oscuro(ropaCol, 0.3), 'stroke-width': 3, fill: 'none' }, torso);
    }
    if (p.ropa === 'bata') {
      S('path', { d: 'M168 354 L200 430 L232 354 Z', fill: '#7fb3d5' }, torso);
      S('path', { d: 'M158 352 L200 436 L176 500 L120 500 Z', fill: '#e4e4de' }, torso);
      S('path', { d: 'M242 352 L200 436 L224 500 L280 500 Z', fill: '#e4e4de' }, torso);
      S('path', { d: 'M150 372 C 140 440 170 470 200 470 C 230 470 260 440 250 372', fill: 'none', stroke: '#2c3e50', 'stroke-width': 5 }, torso);
      S('circle', { cx: 200, cy: 472, r: 11, fill: '#95a5a6' }, torso);
    }
    if (p.ropa === 'vestido') {
      S('path', { d: 'M160 354 Q200 410 240 354', fill: piel }, torso);
      S('path', { d: 'M150 356 Q200 420 250 356 L258 366 Q200 436 142 366 Z', fill: p.colorCuello || '#f1ece2' }, torso);
    }
    if (p.ropa === 'camisa') {
      S('path', { d: 'M158 352 L200 392 L176 410 Z', fill: U.claro(ropaCol, 0.2) }, torso);
      S('path', { d: 'M242 352 L200 392 L224 410 Z', fill: U.claro(ropaCol, 0.2) }, torso);
    }
    if (p.banda) {
      const bg = U.el('g', {}, torso);
      const cols = p.banda === true ? ['#1f4fa3', '#ffffff', '#c8102e'] : p.banda;
      cols.forEach((c, k) => {
        const o = k * 15;
        S('path', { d: `M${292 - o} ${362 + o * 0.25} L${308 - o} ${370 + o * 0.25} L${118 - o} ${500} L${98 - o} ${500} Z`, fill: c, 'stroke-width': 2 }, bg);
      });
    }

    // cuello
    const cuello = U.el('g', {}, root);
    S('path', { d: 'M170 284 L168 352 Q200 372 232 352 L230 284 Z', fill: sombra }, cuello);
    if (p.ropa === 'militar') S('path', { d: 'M158 338 Q200 366 242 338 L246 364 Q200 392 154 364 Z', fill: ropaCol }, cuello), F('path', { d: 'M156 360 Q200 388 244 360', stroke: C.dorado || '#e2b04a', 'stroke-width': 4, fill: 'none' }, cuello);
    if (p.ropa === 'levita') S('path', { d: 'M164 342 Q200 360 236 342 L238 358 L200 368 L162 358 Z', fill: '#f6f2ea' }, cuello);

    // cabeza
    const cab = U.el('g', {}, root);
    [[127, 1], [273, -1]].forEach(([x]) => S('ellipse', { cx: x, cy: 212, rx: 11, ry: 20, fill: piel }, cab));
    const caraD = 'M128 192 C 128 124 160 110 200 110 C 240 110 272 124 272 192 C 272 252 250 302 200 306 C 150 302 128 252 128 192 Z';
    const cid = U.uid('cara'); const cp = U.el('clipPath', { id: cid }, ctx.defs); U.el('path', { d: caraD }, cp);
    S('path', { d: caraD, fill: piel }, cab);
    const sg = U.el('g', { 'clip-path': `url(#${cid})` }, cab);
    F('path', { d: 'M100 120 C 150 170 150 260 210 330 L 100 330 Z', fill: sombra, opacity: 0.55 }, sg);
    F('ellipse', { cx: 236, cy: 168, rx: 26, ry: 34, fill: luz, opacity: 0.5 }, sg);
    if (p.edad === 'mayor') ['M150 250 Q160 262 170 258', 'M250 250 Q240 262 230 258', 'M170 150 Q200 144 230 150'].forEach(d => F('path', { d, stroke: sombra, 'stroke-width': 2.4, fill: 'none' }, cab));

    // ojos
    const ojos = U.el('g', {}, cab);
    [172, 228].forEach(x => {
      S('path', { d: `M${x - 17} 202 Q${x} 191 ${x + 17} 202 Q${x} 211 ${x - 17} 202 Z`, fill: '#f3ede2', 'stroke-width': 2.4 }, ojos);
      F('circle', { cx: x + p.mirada * 5, cy: 202, r: 6.4, fill: p.colorOjos || '#2a1a12' }, ojos);
      F('circle', { cx: x + p.mirada * 5 + 2, cy: 199.5, r: 1.9, fill: '#fff' }, ojos);
      F('path', { d: `M${x - 18} 201 Q${x} 189 ${x + 18} 201`, stroke: ink, 'stroke-width': 4.2, fill: 'none', 'stroke-linecap': 'round' }, ojos);
    });
    const cejaY = p.cejas === 'fruncidas' ? 4 : 0;
    const cejas = U.el('g', {}, cab);
    [[172, 1], [228, -1]].forEach(([x, s]) => F('path', { d: `M${x - 20 * s} ${184 + (s > 0 ? 0 : cejaY)} Q${x} ${174} ${x + 20 * s} ${182 + (s > 0 ? cejaY : 0)}`, stroke: p.colorCejas || U.oscuro(p.colorPelo, 0.1), 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, cejas));
    S('path', { d: 'M201 208 Q197 236 187 246 Q200 254 213 246', fill: 'none', stroke: U.oscuro(piel, 0.42), 'stroke-width': 3 }, cab);
    const boca = p.mujer ? S('path', { d: 'M180 272 Q190 266 200 270 Q210 266 220 272 Q200 286 180 272 Z', fill: p.labios || '#a8434a', 'stroke-width': 2 }, cab)
      : S('path', { d: 'M181 272 Q200 279 219 272', fill: 'none', stroke: U.oscuro(piel, 0.55), 'stroke-width': 3.4 }, cab);
    if (p.mujer) { [[155, -1], [189, 1], [211, -1], [245, 1]].forEach(([x, s]) => F('path', { d: `M${x} 199 l${s * 6} -6`, stroke: ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, ojos)); if (p.aretes !== false) [127, 273].forEach(x => F('circle', { cx: x, cy: 236, r: 6, fill: '#e2c46a', stroke: ink, 'stroke-width': 1.5 }, cab)); }

    // barba y bigote
    const vello = p.colorBarba || p.colorPelo;
    if (p.barba === 'corta') S('path', { d: 'M130 214 C 134 276 162 314 200 316 C 238 314 266 276 270 214 C 262 254 246 266 228 270 Q200 292 172 270 C 154 266 138 254 130 214 Z', fill: vello }, cab);
    if (p.barba === 'larga') S('path', { d: 'M128 210 C 128 300 162 384 200 398 C 238 384 272 300 272 210 C 262 254 246 266 228 270 Q200 292 172 270 C 154 266 138 254 128 210 Z', fill: vello }, cab);
    if (p.barba === 'perilla') S('path', { d: 'M186 284 Q200 296 214 284 L210 318 Q200 326 190 318 Z', fill: vello }, cab);
    if (p.bigote === 'grueso' || p.barba === 'larga' || p.barba === 'corta') S('path', { d: 'M200 256 C 186 250 168 254 160 270 C 174 268 188 265 200 263 C 212 265 226 268 240 270 C 232 254 214 250 200 256 Z', fill: vello }, cab);
    if (p.bigote === 'manubrio') S('path', { d: 'M200 256 C 184 250 166 256 150 266 C 140 272 136 262 142 256 C 132 266 140 282 158 272 C 172 266 188 264 200 263 C 212 264 228 266 242 272 C 260 282 268 266 258 256 C 264 262 260 272 250 266 C 234 256 216 250 200 256 Z', fill: vello }, cab);

    destino = cab;
    // pelo
    const pc = p.colorPelo;
    if (p.pelo === 'corto') S('path', { d: 'M124 196 C 116 122 160 92 206 94 C 252 96 286 126 277 198 C 272 166 264 146 248 136 C 222 146 178 146 152 136 C 138 150 128 170 124 196 Z', fill: pc });
    if (p.pelo === 'rizado') {
      const g = U.el('g', {}, cab); const r = U.rnd(11);
      for (let a = 0; a <= 1; a += 0.07) { const ang = Math.PI * (1.05 + a * 0.9); S('circle', { cx: 200 + Math.cos(ang) * 82, cy: 182 + Math.sin(ang) * 86, r: 20 + r() * 6, fill: pc, 'stroke-width': 2.4 }, g); }
      S('path', { d: 'M126 190 C 126 130 160 104 200 104 C 240 104 274 130 274 190 C 262 160 240 148 200 148 C 160 148 138 160 126 190 Z', fill: pc, 'stroke-width': 0 }, g);
    }
    if (p.pelo === 'calvo') { S('path', { d: 'M126 210 C 122 180 128 160 140 150 C 140 175 138 195 136 214 Z', fill: pc }); S('path', { d: 'M274 210 C 278 180 272 160 260 150 C 260 175 262 195 264 214 Z', fill: pc }); }
    if (p.pelo === 'largo') S('path', { d: 'M124 200 C 114 120 160 90 204 92 C 250 94 288 124 278 200 C 266 158 240 136 200 132 C 166 134 136 156 124 200 Z', fill: pc });
    if (p.pelo === 'recogido') { S('circle', { cx: 200, cy: 92, r: 32, fill: pc }); S('path', { d: 'M124 200 C 114 120 160 100 204 100 C 250 100 288 124 278 200 C 266 158 240 140 200 138 C 166 140 136 156 124 200 Z', fill: pc }); }

    // sombreros
    const sb = p.sombrero, dor = C.dorado || '#e2b04a';
    if (sb === 'bicornio') { S('path', { d: 'M92 140 C 118 62 282 62 308 140 C 262 118 138 118 92 140 Z', fill: '#121212' }); F('path', { d: 'M100 134 C 150 116 250 116 300 134', stroke: dor, 'stroke-width': 4, fill: 'none' }); S('circle', { cx: 200, cy: 104, r: 13, fill: '#c8102e', 'stroke-width': 2 }); F('circle', { cx: 200, cy: 104, r: 7, fill: '#1f4fa3' }); }
    if (sb === 'kepis') { S('path', { d: 'M146 132 L152 70 Q200 58 248 70 L254 132 Z', fill: p.colorSombrero || '#1e2a4a' }); F('path', { d: 'M148 118 L252 118', stroke: dor, 'stroke-width': 5 }); S('path', { d: 'M138 130 Q200 150 262 130 L264 140 Q200 166 136 140 Z', fill: '#111' }); }
    if (sb === 'sombrero') { S('path', { d: 'M96 142 Q200 120 304 142 Q300 156 200 152 Q100 156 96 142 Z', fill: p.colorSombrero || '#2b2420' }); S('path', { d: 'M148 140 L154 86 Q200 74 246 86 L252 140 Z', fill: p.colorSombrero || '#2b2420' }); F('rect', { x: 150, y: 124, width: 100, height: 10, fill: '#111' }); }
    if (sb === 'corona') S('path', { d: 'M140 118 L148 70 L174 98 L200 60 L226 98 L252 70 L260 118 Z', fill: dor });
    if (sb === 'manto') S('path', { d: 'M120 182 C 126 112 168 92 200 92 C 232 92 274 112 280 182 C 254 146 146 146 120 182 Z', fill: p.colorManto || C.manto || '#8a5a3a' });
    if (sb === 'turbante') { S('path', { d: 'M118 168 C 112 96 170 74 202 76 C 240 78 292 100 282 168 C 250 140 150 140 118 168 Z', fill: p.colorSombrero || '#e8dcc0' }); F('path', { d: 'M126 140 C 170 110 240 108 276 140 M130 118 C 180 92 230 94 270 118', stroke: U.oscuro(p.colorSombrero || '#e8dcc0', 0.25), 'stroke-width': 3, fill: 'none' }); }
    if (p.lentes) { S('circle', { cx: 172, cy: 203, r: 22, fill: '#ffffff', 'fill-opacity': 0.12 }, cab); S('circle', { cx: 228, cy: 203, r: 22, fill: '#ffffff', 'fill-opacity': 0.12 }, cab); S('path', { d: 'M194 202 Q200 196 206 202' }, cab); }
    // reloj interno del personaje: dibujo, parpadeo, respiración, giro
    const seed = (def.nombre || 'x').length * 1.7;
    const fills = trazos.map(e => e.getAttribute('fill'));
    return {
      g: root,
      update(t, o = {}) {
        const pd = o.dibujo == null ? 1 : o.dibujo;
        trazos.forEach((e, k) => {
          if (pd >= 1) { e.removeAttribute('stroke-dasharray'); e.removeAttribute('stroke-dashoffset'); e.removeAttribute('fill-opacity'); return; }
          const q = U.clamp(pd * 1.6 - (k / trazos.length) * 0.6);
          U.trazo(e, q);
          if (fills[k] && fills[k] !== 'none') e.setAttribute('fill-opacity', U.clamp((pd - 0.45) * 2.2));
        });
        const bl = ((t + seed) % 3.6);
        const blink = bl < 0.14 ? 1 - Math.sin(bl / 0.14 * Math.PI) * 0.92 : 1;
        ojos.setAttribute('transform', U.sAt(200, 202, 1, blink));
        const ang = U.wob(t, 0.7, seed) * 2.2 + (o.giro || 0);
        cab.setAttribute('transform', `rotate(${ang.toFixed(2)},200,300) translate(0,${(U.wob(t, 1.1, seed) * 1.5).toFixed(2)})`);
        cejas.setAttribute('transform', `translate(0,${(-Math.max(0, Math.sin(t * 0.9 + seed)) * 3).toFixed(2)})`);
        torso.setAttribute('transform', U.sAt(200, 500, 1, 1 + 0.008 * Math.sin(t * 1.6 + seed)));
        if (o.habla) { const m = Math.abs(Math.sin(t * 11)) * 5; boca.setAttribute('d', `M181 272 Q200 ${279 + m} 219 272`); }
      },
    };
  };

  // silueta simple (para escenarios): persona con sombrero / túnica
  APE.silueta = function (parent, x, y, h, color, tipo = 'sombrero', seed = 1) {
    const g = U.el('g', {}, parent);
    const k = h / 100;
    const inner = U.el('g', { transform: `translate(${x},${y}) scale(${k})` }, g);
    if (tipo === 'tunica') {
      U.el('path', { d: 'M-16 0 L-12 -58 Q0 -66 12 -58 L16 0 Z', fill: color }, inner);
      U.el('circle', { cx: 0, cy: -72, r: 10, fill: color }, inner);
      U.el('path', { d: 'M-12 -74 Q0 -92 12 -74 L14 -56 L-14 -56 Z', fill: color }, inner);
    } else {
      U.el('path', { d: 'M-12 0 L-9 -34 L-14 -36 L-12 -66 Q0 -72 12 -66 L14 -36 L9 -34 L12 0 L4 0 L0 -30 L-4 0 Z', fill: color }, inner);
      U.el('circle', { cx: 0, cy: -77, r: 9, fill: color }, inner);
      if (tipo === 'sombrero') { U.el('rect', { x: -15, y: -86, width: 30, height: 4, fill: color }, inner); U.el('rect', { x: -9, y: -96, width: 18, height: 11, fill: color }, inner); }
    }
    return { g, inner, x, y, k };
  };
})();
