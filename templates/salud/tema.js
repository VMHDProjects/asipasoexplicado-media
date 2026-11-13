/* Plantilla: Salud — 5:00 p. m. · palabra "Cuerpo"
   Estilo propio: laboratorio moderno. Verde azulado profundo, coral, menta.
   Cuerpo humano con órganos que se iluminan, células flotando, pulso de electrocardiograma,
   transición circular. */
(function () {
  const { U } = APE;
  const T = APE.temas.salud = {
    nombre: 'Salud',
    palabra: 'Cuerpo',
    colores: {
      fondo: '#0D3440', tinta: '#F1FBFA', acento: '#FF6B5B', acento2: '#5EE3C1', sobreAcento: '#FFFFFF', dorado: '#FFD166',
      mar: '#0A2A33', tierra: '#1C5563', costa: '#5EE3C1', tarjeta: '#124654', fondoRetrato: '#124654', rayasRetrato: '#5EE3C1',
      organo: '#FF6B5B', silueta: '#1A5868', siluetaBorde: '#5EE3C1',
    },
    fuentes: { titulo: 'Poppins', texto: 'Poppins', serif: 'Poppins', cifra: 'Poppins' },
    pesoTitulo: 700, mayusculas: false, marcador: 'caja', radioCaja: 14, contorno: '#0D3440', interlinea: 1.12, tamTexto: 0.92,
    transicion: 'circulo', duracionTransicion: 0.6, marcoRetrato: 'tarjeta',
    grano: 0.05, vineta: 0.45,
    escenario: {
      cielo: ['#9BE3E0', '#F7F3E8'], sol: '#FFE29A', lejos: '#7FB8B0', medio: '#6FA88C', tierra: '#C9D9A8',
      casas: ['#F2B5A0', '#BFE3D8', '#F7E1B5'], tinta: '#0D3440', silueta: '#0D3440', hojas: '#3E8E63', tronco: '#7A5532',
    },
    fondo(ctx, g) {
      const { W, H } = ctx;
      const gid = U.uid('sf'); const lg = U.el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 1, y2: 1 }, ctx.defs);
      U.el('stop', { offset: 0, 'stop-color': '#0F4250' }, lg); U.el('stop', { offset: 1, 'stop-color': '#082028' }, lg);
      U.el('rect', { width: W, height: H, fill: `url(#${gid})` }, g);
      const pid = U.uid('sp'); const pat = U.el('pattern', { id: pid, width: 60, height: 60, patternUnits: 'userSpaceOnUse' }, ctx.defs);
      U.el('path', { d: 'M30 24 V36 M24 30 H36', stroke: '#5EE3C1', 'stroke-width': 2 }, pat);
      const cruces = U.el('rect', { x: -60, y: -60, width: W + 120, height: H + 120, fill: `url(#${pid})`, opacity: 0.07 }, g);
      const r = U.rnd(9);
      const celulas = Array.from({ length: 14 }, () => {
        const c = U.el('g', { opacity: 0.12 + r() * 0.12 }, g); const rr = 30 + r() * 70;
        U.el('circle', { r: rr, fill: 'none', stroke: '#5EE3C1', 'stroke-width': 3 }, c);
        U.el('circle', { r: rr * 0.35, cx: rr * 0.15, cy: -rr * 0.1, fill: '#FF6B5B', opacity: 0.6 }, c);
        return { c, x: r() * W, y: r() * H, vx: (r() - 0.5) * 20, vy: -6 - r() * 14, f: r() * 6 };
      });
      const ecg = U.el('path', { fill: 'none', stroke: '#FF6B5B', 'stroke-width': 4, opacity: 0.35, 'stroke-linejoin': 'round' }, g);
      const yb = H * 0.92;
      return t => {
        cruces.setAttribute('transform', `translate(${(t * 8) % 60},${(t * 4) % 60})`);
        celulas.forEach(c => { const x = ((c.x + t * c.vx) % W + W) % W, y = ((c.y + t * c.vy) % H + H) % H; c.c.setAttribute('transform', `translate(${x},${y}) rotate(${t * 10 + c.f * 50}) scale(${1 + 0.05 * Math.sin(t * 2 + c.f)})`); });
        const off = (t * 300) % 400; let dd = `M0 ${yb}`;
        for (let x = -400 + off; x < W + 400; x += 400) dd += ` L${x} ${yb} L${x + 40} ${yb} L${x + 55} ${yb - 30} L${x + 70} ${yb + 20} L${x + 85} ${yb - 90} L${x + 100} ${yb + 40} L${x + 115} ${yb} L${x + 400} ${yb}`;
        ecg.setAttribute('d', dd);
      };
    },
  };

  // tarjeta redondeada para retratos (Salud y Nutrición)
  APE.marcos.tarjeta = function (ctx, parent, cx, cy, R, def, d) {
    const C = ctx.tema.colores;
    const g = U.el('g', {}, parent);
    const w = R * 1.7, h = R * 2.05, x = cx - w / 2, y = cy - h / 2, rr = 48;
    const cid = U.uid('tj'); const cp = U.el('clipPath', { id: cid }, ctx.defs); const clipR = U.el('rect', { x, y, width: w, height: h, rx: rr }, cp);
    const sombra = U.el('rect', { x, y, width: w, height: h, rx: rr, fill: C.tarjeta, filter: 'url(#ape-sombra)' }, g);
    const inner = U.el('g', { 'clip-path': `url(#${cid})` }, g);
    U.el('rect', { x, y, width: w, height: h, fill: C.fondoRetrato }, inner);
    const blob = U.el('circle', { cx, cy: cy - h * 0.05, r: w * 0.42, fill: C.acento2, opacity: 0.85 }, inner);
    const blob2 = U.el('circle', { cx: cx + w * 0.3, cy: y + h * 0.2, r: w * 0.16, fill: C.acento, opacity: 0.9 }, inner);
    const per = U.el('g', {}, inner);
    const rt = APE.retrato(per, ctx, def);
    const esc = w / 400 * 1.0;
    const borde = U.el('rect', { x, y, width: w, height: h, rx: rr, fill: 'none', stroke: C.acento2, 'stroke-width': 8, pathLength: 1 }, g);
    const etq = d.etiqueta !== false ? (d.etiqueta || def.etiqueta || def.nombre) : null;
    let pill = null;
    if (etq) {
      pill = U.el('g', {}, g);
      const fs = ctx.vertical ? 44 : 40;
      const te = U.el('text', { x: cx, y: y + h + fs * 0.35, 'text-anchor': 'middle', 'font-family': ctx.tema.fuentes.texto, 'font-weight': 700, 'font-size': fs, fill: C.sobreAcento }, pill);
      te.textContent = etq;
      const tw = te.getComputedTextLength() + 70;
      pill.insertBefore(U.el('rect', { x: cx - tw / 2, y: y + h - fs * 0.75, width: tw, height: fs * 1.5, rx: fs * 0.75, fill: C.acento }, pill), te);
    }
    return {
      g,
      update(t) {
        const q = U.back(U.p(t, 0, 0.6));
        g.setAttribute('transform', U.sAt(cx, cy, Math.max(q, 0.001)) + ` rotate(${Math.sin(t * 0.9) * 1.2},${cx},${cy})`);
        U.trazo(borde, U.eo(U.p(t, 0.2, 1.0)));
        blob.setAttribute('r', w * (0.42 + 0.02 * Math.sin(t * 1.4)));
        blob2.setAttribute('transform', `translate(${Math.sin(t) * 14},${Math.cos(t * 1.2) * 10})`);
        per.setAttribute('transform', `translate(${cx - 200 * esc},${y + h - 500 * esc + (1 - U.eo(U.p(t, 0.1, 0.9))) * 80}) scale(${esc})`);
        rt.update(t, { dibujo: U.p(t, 0.05, 1.2), habla: d.habla });
        if (pill) { const qp = U.back(U.p(t, 0.6, 1.0)); pill.setAttribute('transform', U.sAt(cx, y + h, Math.max(qp, 0.001))); }
      },
    };
  };

  // cuerpo humano con órganos que se iluminan
  const ORG = {
    cerebro: { d: 'M150 60 C150 25 250 25 250 60 C270 70 268 108 245 112 C230 125 170 125 155 112 C132 108 130 70 150 60 Z', c: [200, 75], nombre: 'Cerebro' },
    ojos: { d: 'M168 128 a10 7 0 1 0 20 0 a10 7 0 1 0 -20 0 M212 128 a10 7 0 1 0 20 0 a10 7 0 1 0 -20 0', c: [200, 128], nombre: 'Ojos' },
    tiroides: { d: 'M184 205 C184 195 196 196 200 204 C204 196 216 195 216 205 C216 215 206 218 200 212 C194 218 184 215 184 205 Z', c: [200, 205], nombre: 'Tiroides' },
    pulmones: { d: 'M190 250 C160 248 140 280 138 330 C136 370 150 392 175 386 C188 380 192 360 192 330 Z M210 250 C240 248 260 280 262 330 C264 370 250 392 225 386 C212 380 208 360 208 330 Z', c: [200, 320], nombre: 'Pulmones' },
    corazon: { d: 'M212 300 C212 286 232 282 238 296 C244 282 266 288 262 306 C258 326 236 340 232 348 C222 338 204 324 204 308 C204 302 208 300 212 300 Z', c: [232, 314], nombre: 'Corazón' },
    higado: { d: 'M140 398 C160 386 210 386 222 396 C226 412 210 428 186 432 C160 436 140 424 140 398 Z', c: [180, 410], nombre: 'Hígado' },
    estomago: { d: 'M228 392 C250 386 266 400 262 424 C258 448 236 456 220 448 C210 440 220 430 230 426 C236 418 226 404 228 392 Z', c: [244, 422], nombre: 'Estómago' },
    rinones: { d: 'M160 456 C150 456 146 476 152 488 C158 498 172 494 172 478 C172 466 168 456 160 456 Z M240 456 C250 456 254 476 248 488 C242 498 228 494 228 478 C228 466 232 456 240 456 Z', c: [200, 474], nombre: 'Riñones' },
    intestino: { d: 'M158 462 C158 448 242 448 242 462 L242 540 C242 556 158 556 158 540 Z', c: [200, 500], nombre: 'Intestinos' },
    pancreas: { d: 'M188 440 C200 432 236 434 244 444 C238 452 206 452 188 448 Z', c: [216, 443], nombre: 'Páncreas' },
    vejiga: { d: 'M186 572 C186 556 214 556 214 572 C214 588 186 588 186 572 Z', c: [200, 572], nombre: 'Vejiga' },
    huesos: { d: 'M196 200 H204 V600 H196 Z M150 240 H250 V248 H150 Z', c: [200, 400], nombre: 'Huesos' },
    piel: { d: 'M200 18 C238 18 258 48 258 92 C258 130 240 158 222 168 L222 190 C268 198 300 214 312 250 L340 470 L316 476 L292 300 L284 600 L270 960 L222 960 L206 640 L194 640 L178 960 L130 960 L116 600 L108 300 L84 476 L60 470 L88 250 C100 214 132 198 178 190 L178 168 C160 158 142 130 142 92 C142 48 162 18 200 18 Z', c: [200, 300], nombre: 'Piel' },
  };
  const SIL = ORG.piel.d;

  APE.escenas.cuerpo = function (ctx, d, b) {
    const { W, H, vertical } = ctx, C = T.colores;
    const g = U.el('g', {}, b.cam);
    const k = vertical ? 1.05 : 0.9;
    const ox = vertical ? W / 2 - 200 * k : W * 0.66 - 200 * k, oy = vertical ? H * 0.1 : (H - 980 * k) / 2;
    const body = U.el('g', { transform: `translate(${ox},${oy}) scale(${k})` }, g);
    const halo = U.el('ellipse', { cx: 200, cy: 480, rx: 260, ry: 520, fill: C.acento2, opacity: 0.08, filter: 'url(#ape-blur30)' }, body);
    const sil = U.el('path', { d: SIL, fill: C.silueta, stroke: C.siluetaBorde, 'stroke-width': 4, pathLength: 1 }, body);
    const scan = U.el('rect', { x: 40, width: 320, height: 26, fill: C.acento2, opacity: 0.35 }, body);
    const cid = U.uid('sil'); const cp = U.el('clipPath', { id: cid }, ctx.defs); U.el('path', { d: SIL }, cp);
    scan.setAttribute('clip-path', `url(#${cid})`);
    const base = U.el('g', { opacity: 0.35 }, body);
    ['cerebro', 'pulmones', 'corazon', 'higado', 'estomago', 'intestino'].forEach(n => U.el('path', { d: ORG[n].d, fill: 'none', stroke: C.siluetaBorde, 'stroke-width': 2.5 }, base));
    const organos = (d.organos || []).map((o, i) => {
      const def = ORG[o.id] || ORG.corazon;
      const og = U.el('g', {}, body);
      const glow = U.el('path', { d: def.d, fill: o.color || C.organo, opacity: 0.5, filter: 'url(#ape-blur8)' }, og);
      const pth = U.el('path', { d: def.d, fill: o.color || C.organo, stroke: '#FFFFFF', 'stroke-width': 2.5 }, og);
      const [cx, cy] = def.c;
      const lado = o.lado || (vertical ? (i % 2 ? 1 : -1) : 1);
      const lx = vertical ? (lado < 0 ? 110 : 300) : (lado < 0 ? -40 : 440);
      const linea = U.el('path', { d: `M${cx} ${cy} L${(cx + lx) / 2} ${cy - 40} L${lx} ${cy - 40}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, pathLength: 1 }, og);
      const lbl = U.el('text', { x: lx + lado * 12, y: cy - 28, 'text-anchor': lado < 0 ? 'end' : 'start', 'font-family': 'Poppins', 'font-weight': 700, 'font-size': (vertical ? 36 : 40) / k, fill: C.tinta, stroke: C.fondo, 'stroke-width': 8, 'paint-order': 'stroke' }, og);
      lbl.textContent = o.etiqueta || def.nombre;
      return { o, og, glow, pth, linea, lbl, cx, cy, t: o.t ?? 0.8 + i };
    });
    const keys = [{ t: 0, x: W / 2, y: H / 2, s: 0.95 }, { t: 1.2, x: W / 2, y: H / 2, s: 1 }];
    organos.forEach(o => { if (o.o.zoom === false) return; const pv = keys[keys.length - 1]; keys.push({ t: Math.max(o.t, pv.t + 0.01), x: pv.x, y: pv.y, s: pv.s }); keys.push({ t: o.t + 0.8, x: vertical ? W / 2 : W / 2 + (ox + o.cx * k - W / 2) * 0.5, y: oy + o.cy * k, s: o.o.escala || (vertical ? 1.08 : 1.45) }); });
    const kl = keys[keys.length - 1]; keys.push({ t: b.dur + 0.6, x: kl.x, y: kl.y, s: kl.s * 1.04 });
    const cam = APE.camara(b.cam, ctx, keys);
    const caja = vertical ? { x: W / 2, y: H * 0.8, w: W * 0.86, size: 80 * T.tamTexto, anchor: 'middle', vAnchor: 'middle' } : { x: 130, y: H * 0.5, w: W * 0.36, size: 92 * T.tamTexto, anchor: 'start', vAnchor: 'middle' };
    return {
      cajaTexto: caja,
      update(t) {
        cam(t);
        U.trazo(sil, U.eio(U.p(t, 0, 1.0)));
        sil.setAttribute('fill-opacity', U.p(t, 0.5, 1.0));
        const sy = ((t * 300) % 1100) - 60; scan.setAttribute('y', sy);
        base.setAttribute('opacity', 0.35 * U.p(t, 0.6, 1.0));
        halo.setAttribute('opacity', 0.08 + 0.04 * Math.sin(t * 2));
        organos.forEach(o => {
          const q = U.p(t, o.t, o.t + 0.5);
          U.show(o.og, q > 0);
          if (q <= 0) return;
          const lat = 1 + 0.06 * Math.max(0, Math.sin((t - o.t) * (o.o.id === 'corazon' ? 7 : 3)));
          o.pth.setAttribute('transform', U.sAt(o.cx, o.cy, U.back(q) * lat));
          o.glow.setAttribute('transform', U.sAt(o.cx, o.cy, 1.15 * lat));
          o.glow.setAttribute('opacity', 0.35 + 0.3 * Math.sin((t - o.t) * 4));
          U.trazo(o.linea, U.eo(U.p(t, o.t + 0.3, o.t + 0.8)));
          o.lbl.setAttribute('opacity', U.p(t, o.t + 0.6, o.t + 0.9));
        });
      },
    };
  };
})();
