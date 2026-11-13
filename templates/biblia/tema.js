/* Plantilla: Biblia — 12:00 m. · palabra "Biblia"
   Estilo: papiro antiguo. Fibras de papiro, tinta sepia, rojo de rúbrica, oro viejo.
   Versículos que se escriben a pluma sobre un rollo (Reina-Valera 1960), marcos en arco,
   transición de borde quemado. */
(function () {
  const { U } = APE;
  const T = APE.temas.biblia = {
    nombre: 'Biblia',
    palabra: 'Biblia',
    colores: {
      fondo: '#E6CF9C', tinta: '#3B2412', acento: '#8E1F1A', acento2: '#B8862B', sobreAcento: '#F7ECD2', dorado: '#C99A3A',
      mar: '#9DB3A1', tierra: '#E3C78E', costa: '#3B2412', reticula: '#7A5A36', etiqueta: '#5A3A1E', etiquetaPin: '#3B2412',
      contornoTexto: '#EBD7A8', contornoPin: '#3B2412', ruta: '#8E1F1A', manto: '#7B2D4F',
      fondoRetrato: '#F1E2BC', rayasRetrato: '#7A5A36', tarjeta: '#F1E2BC', brasa: '#C8641E', tintaOscura: '#2A1608',
    },
    fuentes: { titulo: 'Pagella', texto: 'Pagella', serif: 'Pagella', cifra: 'Pagella', verso: 'Baskerville' },
    pesoTitulo: 700, mayusculas: false, marcador: 'subrayado', contorno: null, interlinea: 1.12, tamTexto: 1.0,
    transicion: 'quemado', duracionTransicion: 0.7, marcoRetrato: 'arco',
    grano: 0.12, vineta: 0.75, colorVineta: '#3B2412', tintaRetrato: '#2A1608',
    escenario: {
      cielo: ['#F1D9A6', '#E7B77A'], sol: '#FFF1C9', lejos: '#C9A270', medio: '#D8B27E', tierra: '#E4C48E',
      casas: ['#B4553A', '#E9DCC0', '#7E5B3A', '#CFAE7C'], tinta: '#3B2412', silueta: '#3B2412', hojas: '#6E7F3A',
      tronco: '#7A5532', piedra: '#CDB287', nube: '#FBEFD6', puerta: '#3B2412', ventana: '#F7E3B0', persiana: '#7E5B3A', tejado: '#9A4A2E',
    },
    fondo(ctx, g) {
      const { W, H } = ctx;
      const gid = U.uid('bf'); const rg = U.el('radialGradient', { id: gid, cx: '50%', cy: '45%', r: '75%' }, ctx.defs);
      U.el('stop', { offset: 0, 'stop-color': '#F2DFB1' }, rg); U.el('stop', { offset: 1, 'stop-color': '#D4B475' }, rg);
      U.el('rect', { width: W, height: H, fill: `url(#${gid})` }, g);
      // fibras de papiro (tiras horizontales y verticales)
      const r = U.rnd(21); const fib = U.el('g', { opacity: 0.22 }, g);
      for (let i = 0; i < 90; i++) { const y = r() * H; U.el('rect', { x: -20, y, width: W + 40, height: 1 + r() * 3, fill: r() < 0.5 ? '#9C7A46' : '#FFF4D6', opacity: 0.4 + r() * 0.6 }, fib); }
      for (let i = 0; i < 50; i++) { const x = r() * W; U.el('rect', { x, y: -20, width: 1 + r() * 2.5, height: H + 40, fill: r() < 0.5 ? '#9C7A46' : '#FFF4D6', opacity: 0.25 + r() * 0.4 }, fib); }
      const manchas = Array.from({ length: 5 }, () => U.el('circle', { cx: r() * W, cy: r() * H, r: 120 + r() * 220, fill: '#8C6233', opacity: 0.08, filter: 'url(#ape-blur30)' }, g));
      const luz = U.el('ellipse', { rx: W * 0.45, ry: H * 0.4, fill: '#FFF6D8', opacity: 0.35, filter: 'url(#ape-blur30)' }, g);
      const motas = Array.from({ length: 30 }, () => ({ e: U.el('circle', { r: 1 + r() * 2, fill: '#FFF8E2' }, g), x: r() * W, y: r() * H, v: 5 + r() * 12, f: r() * 6 }));
      return t => {
        fib.setAttribute('transform', `translate(${Math.sin(t * 0.2) * 6},${Math.cos(t * 0.17) * 4})`);
        luz.setAttribute('cx', W * (0.5 + 0.12 * Math.sin(t * 0.25))); luz.setAttribute('cy', H * (0.42 + 0.08 * Math.cos(t * 0.2)));
        motas.forEach(m => { m.e.setAttribute('cx', m.x + Math.sin(t * 0.4 + m.f) * 30); m.e.setAttribute('cy', ((m.y - t * m.v) % H + H) % H); m.e.setAttribute('opacity', 0.2 + 0.4 * Math.abs(Math.sin(t * 0.8 + m.f))); });
      };
    },
    decorTitular(ctx, g) {
      const { W, H, vertical } = ctx, C = T.colores;
      const y1 = vertical ? H * 0.36 : H * 0.27, y2 = vertical ? H * 0.6 : H * 0.74;
      const els = [];
      [y1, y2].forEach(y => {
        els.push(U.el('path', { d: `M${W * 0.2} ${y} H${W * 0.44} M${W * 0.56} ${y} H${W * 0.8}`, stroke: C.acento2, 'stroke-width': 4, fill: 'none', pathLength: 1 }, g));
        els.push(U.el('path', { d: `M${W / 2} ${y - 22} L${W / 2 + 22} ${y} L${W / 2} ${y + 22} L${W / 2 - 22} ${y} Z`, fill: C.acento, stroke: C.acento2, 'stroke-width': 3, pathLength: 1 }, g));
      });
      return t => els.forEach((e, i) => { U.trazo(e, U.eo(U.p(t, 0.1 + i * 0.12, 0.9 + i * 0.12))); e.setAttribute('transform', i % 2 ? `rotate(${t * 20},${W / 2},${i < 2 ? y1 : y2})` : ''); });
    },
  };

  // marco en arco (como ventana de templo)
  APE.marcos.arco = function (ctx, parent, cx, cy, R, def, d) {
    const C = ctx.tema.colores;
    const g = U.el('g', {}, parent);
    const w = R * 1.6, h = R * 2.1, x = cx - w / 2, y = cy - h / 2;
    const dd = `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`;
    const cid = U.uid('arc'); const cp = U.el('clipPath', { id: cid }, ctx.defs); const clipR = U.el('rect', { x: x - 10, width: w + 20 }, cp);
    const inner = U.el('g', { 'clip-path': `url(#${cid})` }, g);
    const fondoA = U.el('path', { d: dd, fill: C.fondoRetrato }, inner);
    const gl = U.el('circle', { cx, cy: y + w / 2, r: w * 0.55, fill: '#FFF6D8', opacity: 0.9, filter: 'url(#ape-blur30)' }, inner);
    const rayos = U.el('g', { opacity: 0.18 }, inner);
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; U.el('path', { d: `M${cx} ${y + w / 2} l${Math.cos(a) * 900} ${Math.sin(a) * 900} l${Math.cos(a + 0.08) * 900 - Math.cos(a) * 900} ${Math.sin(a + 0.08) * 900 - Math.sin(a) * 900} Z`, fill: C.acento2 }, rayos); }
    const per = U.el('g', {}, inner);
    const mcid = U.uid('arcm'); const mcp = U.el('clipPath', { id: mcid }, ctx.defs); U.el('path', { d: dd }, mcp);
    inner.setAttribute('clip-path', `url(#${mcid})`);
    const wrap = U.el('g', { 'clip-path': `url(#${cid})` }, g); wrap.appendChild(inner);
    const rt = APE.retrato(per, ctx, def);
    const esc = w / 400 * 1.02;
    const borde = U.el('path', { d: dd, fill: 'none', stroke: C.acento2, 'stroke-width': 14, pathLength: 1 }, g);
    const borde2 = U.el('path', { d: dd, fill: 'none', stroke: C.tinta, 'stroke-width': 3, pathLength: 1, transform: U.sAt(cx, cy, 1.06) }, g);
    const etq = d.etiqueta !== false ? (d.etiqueta || def.etiqueta || def.nombre) : null;
    let cinta = null;
    if (etq) {
      cinta = U.el('g', {}, g);
      const fs = ctx.vertical ? 50 : 46;
      const te = U.el('text', { x: cx, y: y + h + 14, 'text-anchor': 'middle', 'font-family': 'Pagella', 'font-size': fs, fill: C.sobreAcento, 'letter-spacing': 2 }, cinta);
      te.textContent = etq;
      const tw = te.getComputedTextLength() + 90;
      const rr = U.el('path', { d: `M${cx - tw / 2} ${y + h - fs * 0.9} h${tw} l-24 ${fs * 0.65} l24 ${fs * 0.65} h${-tw} l24 ${-fs * 0.65} Z`, fill: C.acento, stroke: C.acento2, 'stroke-width': 3 }, cinta);
      cinta.insertBefore(rr, te);
    }
    return {
      g,
      update(t) {
        const q = U.eoq(U.p(t, 0, 0.9));
        clipR.setAttribute('y', y + h - (h + 20) * q); clipR.setAttribute('height', (h + 20) * q + 10);
        U.trazo(borde, U.eo(U.p(t, 0.1, 1.0))); U.trazo(borde2, U.eo(U.p(t, 0.3, 1.2)));
        rayos.setAttribute('transform', `rotate(${t * 5},${cx},${y + w / 2})`);
        gl.setAttribute('opacity', 0.75 + 0.2 * Math.sin(t * 1.5));
        per.setAttribute('transform', `translate(${cx - 200 * esc},${y + h - 500 * esc + (1 - U.eo(U.p(t, 0.1, 1))) * 80}) scale(${esc})`);
        rt.update(t, { dibujo: U.p(t, 0.05, 1.5) });
        if (cinta) { const qc = U.back(U.p(t, 0.8, 1.25)); cinta.setAttribute('transform', U.sAt(cx, y + h, Math.max(qc, 0.001), 1)); }
      },
    };
  };

  // versículo escrito a pluma sobre un rollo (RVR1960)
  APE.escenas.versiculo = function (ctx, d, b) {
    const { W, H, vertical } = ctx, C = T.colores;
    const g = U.el('g', {}, b.cam);
    const pw = vertical ? W * 0.9 : W * 0.78, ph = vertical ? H * 0.5 : H * 0.66;
    const cx = W / 2, cy = vertical ? H * 0.47 : H * 0.48;
    const papel = U.el('g', {}, g);
    const pid = U.uid('pp'); const lg = U.el('linearGradient', { id: pid, x1: 0, y1: 0, x2: 0, y2: 1 }, ctx.defs);
    U.el('stop', { offset: 0, 'stop-color': '#F6E7C1' }, lg); U.el('stop', { offset: 0.5, 'stop-color': '#EFDCAE' }, lg); U.el('stop', { offset: 1, 'stop-color': '#E0C48C' }, lg);
    const hoja = U.el('rect', { y: cy - ph / 2, height: ph, fill: `url(#${pid})`, stroke: '#9C7A46', 'stroke-width': 2, filter: 'url(#ape-sombra)' }, papel);
    const lineasGuia = U.el('g', { opacity: 0.18 }, papel);
    const rodillo = () => { const r = U.el('g', {}, g); U.el('rect', { x: -26, y: cy - ph / 2 - 40, width: 52, height: ph + 80, rx: 26, fill: '#6B4423', stroke: '#2A1608', 'stroke-width': 3 }, r); U.el('rect', { x: -10, y: cy - ph / 2 - 40, width: 10, height: ph + 80, fill: '#9A6A3C', opacity: 0.7 }, r); [-1, 1].forEach(s => U.el('ellipse', { cx: 0, cy: cy + s * (ph / 2 + 56), rx: 22, ry: 16, fill: '#4A2C14', stroke: '#2A1608', 'stroke-width': 3 }, r)); return r; };
    const rIzq = rodillo(), rDer = rodillo();
    // texto del versículo
    const margen = vertical ? 70 : 110;
    const ancho = pw - margen * 2;
    const txt = String(d.versiculo || '');
    const tokens = []; let hl = false;
    let finEsp = true;
    txt.split(/(\*)/).forEach(p => { if (p === '*') { hl = !hl; return; } const peg = p.length && !/^\s/.test(p) && tokens.length && !finEsp; if (p.length) finEsp = /\s$/.test(p); p.split(/\s+/).filter(Boolean).forEach((w, k) => tokens.push({ w, hl, glue: peg && k === 0 })); });
    let fs = d.tam || (vertical ? 74 : 84), sp, lines, lh;
    const meas = U.el('text', { 'font-family': 'Baskerville' }, g);
    for (;;) {
      meas.setAttribute('font-size', fs);
      meas.textContent = 'a a'; const a1 = meas.getComputedTextLength(); meas.textContent = 'aa'; sp = a1 - meas.getComputedTextLength();
      tokens.forEach(tk => { meas.textContent = tk.w; tk.wd = meas.getComputedTextLength(); });
      lines = [[]]; let lw = 0;
      tokens.forEach(tk => { const cur = lines[lines.length - 1]; const add = (cur.length && !tk.glue ? sp : 0) + tk.wd; if (lw + add > ancho && cur.length && !tk.glue) { lines.push([tk]); lw = tk.wd; } else { cur.push(tk); lw += add; } });
      lh = fs * 1.38;
      if (lines.length * lh <= ph * 0.7 || fs <= 40) break;
      fs -= 4;
    }
    meas.remove();
    const top = cy - (lines.length * lh) / 2 - (vertical ? 40 : 34);
    const L = lines.map((ln, i) => {
      const width = ln.reduce((a, tk, k) => a + tk.wd + (k && !tk.glue ? sp : 0), 0);
      const x0 = cx - width / 2, base = top + i * lh + fs;
      const cid = U.uid('vl'); const cp = U.el('clipPath', { id: cid }, ctx.defs); const rc = U.el('rect', { x: x0 - 10, y: base - fs * 1.1, height: fs * 1.5, width: 0 }, cp);
      const te = U.el('text', { x: x0, y: base, 'font-family': 'Baskerville', 'font-size': fs, fill: C.tinta, 'clip-path': `url(#${cid})` }, g);
      let off = 0; const marcados = [];
      ln.forEach((tk, k) => { const gap = k && !tk.glue ? 1 : 0; const ts = U.el('tspan', { fill: tk.hl ? C.acento : C.tinta }, te); ts.textContent = (gap ? ' ' : '') + tk.w; if (tk.hl) marcados.push([off + gap, tk.w.length]); off += gap + tk.w.length; });
      const real = te.getComputedTextLength();
      const xr = cx - real / 2; te.setAttribute('x', xr); rc.setAttribute('x', xr - 10);
      const subr = marcados.map(([i, n]) => ({ x: xr + te.getSubStringLength(0, i), w: te.getSubStringLength(i, n) }));
      U.el('line', { x1: cx - ancho / 2, y1: base + fs * 0.28, x2: cx + ancho / 2, y2: base + fs * 0.28, stroke: '#7A5A36', 'stroke-width': 1.5 }, lineasGuia);
      const marcas = subr.map(s => U.el('line', { x1: s.x, y1: base + fs * 0.22, x2: s.x + s.w, y2: base + fs * 0.22, stroke: C.acento, 'stroke-width': 4, pathLength: 1, 'stroke-linecap': 'round' }, g));
      return { rc, x0: xr, width: real, base, n: ln.reduce((a, tk) => a + tk.w.length + 1, 0), marcas };
    });
    const total = L.reduce((a, l) => a + l.n, 0);
    const tW0 = d.tInicio ?? 1.0, tW1 = d.tEscritura ?? Math.max(tW0 + 1, b.dur - 1.3);
    let acc = 0; L.forEach(l => { l.a = tW0 + (acc / total) * (tW1 - tW0); acc += l.n; l.b = tW0 + (acc / total) * (tW1 - tW0); });
    const ref = U.el('text', { x: cx, y: top + lines.length * lh + fs * 0.9, 'text-anchor': 'middle', 'font-family': 'Pagella', 'font-style': 'italic', 'font-size': fs * 0.72, fill: C.acento, 'letter-spacing': 2 }, g);
    ref.textContent = (d.cita || '') + (d.version === false ? '' : ' · RVR1960');
    const sello = U.el('g', {}, g);
    const sx = cx + pw / 2 - (vertical ? 110 : 150), sy = cy + ph / 2 - (vertical ? 90 : 110);
    U.el('circle', { cx: sx, cy: sy, r: 58, fill: '#9E2A22', stroke: '#6E1A14', 'stroke-width': 6 }, sello);
    U.el('circle', { cx: sx, cy: sy, r: 40, fill: 'none', stroke: '#F0C9A6', 'stroke-width': 2.5, opacity: 0.7 }, sello);
    U.el('path', { d: `M${sx} ${sy - 26} V${sy + 26} M${sx - 18} ${sy - 8} H${sx + 18}`, stroke: '#F0C9A6', 'stroke-width': 6, 'stroke-linecap': 'round' }, sello);
    const pluma = U.el('g', {}, g);
    U.el('path', { d: 'M0 0 C 20 -40 60 -110 120 -150 C 100 -100 70 -50 14 -6 Z', fill: '#F7F1E3', stroke: '#3B2412', 'stroke-width': 3 }, pluma);
    U.el('path', { d: 'M0 0 L 90 -118', stroke: '#3B2412', 'stroke-width': 2.5 }, pluma);
    let camY = cy;
    return {
      cajaTexto: APE.cajaTexto(ctx, 'arriba'),
      update(t) {
        const act = L.reduce((a, l) => (t >= l.a ? l : a), L[0]);
        const objetivo = L.length > 2 && t > tW0 ? act.base - fs * 0.4 : cy;
        const ki = U.p(t, act.a, act.a + 0.6);
        camY = U.lerp(cy, objetivo, U.eio(U.p(t, tW0, tW0 + 0.8)));
        const sc = 0.97 + 0.09 * U.eio(U.p(t, 0.5, tW1)) + 0.012 * Math.sin(t * 0.9);
        const yy = U.lerp(cy, camY, 0.35);
        b.cam.setAttribute('transform', `translate(${W / 2 + Math.sin(t * 0.5) * 6},${H / 2}) scale(${sc}) translate(${-W / 2},${-yy})`);
        const q = U.eio(U.p(t, 0.05, 0.95));
        const wv = 40 + (pw - 40) * q;
        hoja.setAttribute('x', cx - wv / 2); hoja.setAttribute('width', wv);
        rIzq.setAttribute('transform', `translate(${cx - wv / 2},0)`); rDer.setAttribute('transform', `translate(${cx + wv / 2},0)`);
        lineasGuia.setAttribute('opacity', 0.18 * U.p(t, 0.7, 1.0));
        let px = null, py = null;
        L.forEach(l => {
          const ql = U.p(t, l.a, l.b);
          l.rc.setAttribute('width', (l.width + 20) * ql);
          if (ql > 0 && ql < 1) { px = l.x0 + l.width * ql; py = l.base; }
          l.marcas.forEach(m => U.trazo(m, U.eo(U.p(t, l.b, l.b + 0.4))));
        });
        U.show(pluma, px !== null);
        if (px !== null) pluma.setAttribute('transform', `translate(${px},${py - 4 + Math.sin(t * 30) * 3}) rotate(${Math.sin(t * 12) * 4})`);
        const qr = U.eo(U.p(t, tW1 + 0.1, tW1 + 0.6));
        ref.setAttribute('opacity', qr); ref.setAttribute('letter-spacing', 2 + (1 - qr) * 12);
        const qs = U.p(t, tW1 + 0.4, tW1 + 0.75);
        U.show(sello, qs > 0);
        sello.setAttribute('transform', U.sAt(sx, sy, qs < 1 ? 2.2 - 1.2 * U.ei(qs) : 1) + ` rotate(-12,${sx},${sy})`);
        sello.setAttribute('opacity', U.p(t, tW1 + 0.4, tW1 + 0.5));
      },
    };
  };
})();

/* Escenas propias de Biblia: genealogía, arca y tronos */
(function () {
  const { U, Texto } = APE;
  const C = () => APE.temas.biblia.colores;

  // cadena de nombres con años; uno se resalta (p. ej. Enoc, el que "desapareció")
  APE.escenas.genealogia = function (ctx, d, b) {
    const { W, H, vertical } = ctx, c = C();
    const g = U.el('g', {}, b.cam);
    const items = d.nombres || [];
    const sp = vertical ? 300 : 360, y = vertical ? H * 0.42 : H * 0.5;
    const linea = U.el('path', { d: `M${-sp} ${y} H${sp * items.length}`, stroke: c.acento2, 'stroke-width': 5, fill: 'none', pathLength: 1 }, g);
    const N = items.map((it, i) => {
      const x = i * sp, ng = U.el('g', {}, g);
      const marco = U.el('rect', { x: x - 130, y: y - 110, width: 260, height: 220, rx: 18, fill: '#F6E7C1', stroke: it.resaltar ? c.acento : '#9C7A46', 'stroke-width': it.resaltar ? 7 : 3, filter: 'url(#ape-sombra)' }, ng);
      const nom = U.el('text', { x, y: y - 30, 'text-anchor': 'middle', 'font-family': 'Pagella', 'font-size': 54, fill: c.tinta }, ng); nom.textContent = it.nombre;
      const anos = U.el('text', { x, y: y + 34, 'text-anchor': 'middle', 'font-family': 'Pagella', 'font-size': 40, fill: c.acento2 }, ng);
      const sello = U.el('text', { x, y: y + 88, 'text-anchor': 'middle', 'font-family': 'Pagella', 'font-style': 'italic', 'font-size': 38, fill: c.acento }, ng);
      sello.textContent = it.final || 'y murió';
      return { it, x, ng, anos, sello, t: it.t ?? i * 0.8 };
    });
    const keys = [{ t: 0, x: -sp * 0.2, y: H / 2, s: vertical ? 0.8 : 0.9 }];
    N.forEach(n => { const pv = keys[keys.length - 1]; keys.push({ t: Math.max(n.t, pv.t + 0.01), x: pv.x, y: H / 2, s: pv.s }); keys.push({ t: n.t + 0.5, x: n.x - (vertical ? 0 : sp * 0.6), y: H / 2, s: n.it.resaltar ? 1.15 : pv.s }); });
    const kl = keys[keys.length - 1]; keys.push({ t: b.dur + 0.7, x: kl.x + 20, y: H / 2, s: kl.s * 1.03 });
    const cam = APE.camara(b.cam, ctx, keys);
    return {
      cajaTexto: APE.cajaTexto(ctx, vertical ? 'abajo' : 'arriba'),
      update(t) {
        cam(t);
        const ult = N.reduce((a, n, i) => (t >= n.t ? i : a), -1);
        U.trazo(linea, U.eo(U.clamp((ult + 1) / (N.length + 0.5))));
        N.forEach((n, i) => {
          const q = U.p(t, n.t, n.t + 0.45); U.show(n.ng, q > 0); if (q <= 0) return;
          n.ng.setAttribute('transform', U.sAt(n.x, y, U.back(q)));
          n.ng.setAttribute('opacity', i === ult || n.it.resaltar ? 1 : 0.6);
          n.anos.textContent = n.it.anos ? Math.round(n.it.anos * U.eo(U.p(t, n.t + 0.1, n.t + 0.6))) + ' años' : '';
          const qs = U.p(t, n.t + 0.45, n.t + 0.7);
          n.sello.setAttribute('opacity', qs); n.sello.setAttribute('transform', U.sAt(n.x, y + 80, qs < 1 ? 1.8 - 0.8 * qs : 1));
        });
      },
    };
  };

  // el Arca del Pacto: se dibuja, brilla y puede "desaparecer"
  APE.escenas.arca = function (ctx, d, b) {
    const { W, H, vertical } = ctx, c = C();
    const g = U.el('g', {}, b.cam);
    const cx = W / 2, cy = vertical ? H * 0.4 : H * 0.48, k = vertical ? 1.1 : 1.0;
    const brillo = U.el('circle', { cx, cy, r: 420 * k, fill: '#FFF1B8', opacity: 0.6, filter: 'url(#ape-blur30)' }, g);
    const rayos = U.el('g', { opacity: 0.25 }, g);
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; U.el('path', { d: `M${cx} ${cy} L${cx + Math.cos(a) * 1500} ${cy + Math.sin(a) * 1500} L${cx + Math.cos(a + 0.08) * 1500} ${cy + Math.sin(a + 0.08) * 1500} Z`, fill: c.acento2 }, rayos); }
    const arca = U.el('g', { transform: `translate(${cx},${cy}) scale(${k})` }, g);
    const oro = '#D9A640', oroO = '#9C7020';
    const P = (dd, f) => U.el('path', { d: dd, fill: f, stroke: '#4A2C10', 'stroke-width': 4, 'stroke-linejoin': 'round', pathLength: 1 }, arca);
    const partes = [
      P('M-260 60 H260 V40 H-260 Z', oroO), P('M-300 20 H300 V34 H-300 Z', oroO),
      P('M-230 -40 H230 V150 H-230 Z', oro), P('M-250 -60 H250 V-36 H-250 Z', oroO),
      P('M-200 0 H200 M-200 100 H200', 'none'),
      P('M-60 -60 C -140 -150 -230 -170 -250 -230 C -170 -200 -110 -170 -40 -100 Z', oro),
      P('M60 -60 C 140 -150 230 -170 250 -230 C 170 -200 110 -170 40 -100 Z', oro),
      P('M-70 -60 Q -40 -110 -10 -60 Z M70 -60 Q 40 -110 10 -60 Z', oroO),
      P('M-210 150 V180 H-180 V150 Z M180 150 V180 H210 V150 Z', oroO),
    ];
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: cx, y: H / 2, s: 0.92 }, { t: b.dur + 0.7, x: cx, y: H / 2 - 20, s: 1.08 }]);
    const fuga = d.desaparece;
    return {
      cajaTexto: APE.cajaTexto(ctx, vertical ? 'abajo' : 'abajo'),
      update(t) {
        cam(t);
        partes.forEach((p, i) => { const q = U.eio(U.p(t, 0.05 + i * 0.12, 0.8 + i * 0.12)); U.trazo(p, q); p.setAttribute('fill-opacity', U.p(t, 0.6 + i * 0.12, 1.1 + i * 0.12)); });
        rayos.setAttribute('transform', `rotate(${t * 6},${cx},${cy})`);
        let op = 1;
        if (fuga != null) op = 1 - U.eio(U.p(t, fuga, fuga + 1.4));
        arca.setAttribute('opacity', op);
        arca.setAttribute('transform', `translate(${cx},${cy + Math.sin(t * 1.3) * 8 - (fuga != null ? U.p(t, fuga, fuga + 1.4) * 60 : 0)}) scale(${k})`);
        brillo.setAttribute('opacity', (0.45 + 0.15 * Math.sin(t * 2)) * (0.3 + 0.7 * op));
      },
    };
  };

  // trono central y 24 tronos alrededor
  APE.escenas.tronos = function (ctx, d, b) {
    const { W, H, vertical } = ctx, c = C();
    const g = U.el('g', {}, b.cam);
    const cx = W / 2, cy = vertical ? H * 0.4 : H * 0.44, R = vertical ? 400 : 330;
    U.el('circle', { cx, cy, r: R * 0.55, fill: '#FFF6D8', opacity: 0.9, filter: 'url(#ape-blur30)' }, g);
    const aro = U.el('circle', { cx, cy, r: R, fill: 'none', stroke: c.acento2, 'stroke-width': 3, 'stroke-dasharray': '4 10' }, g);
    const trono = (x, y, s, col) => { const tg = U.el('g', { transform: `translate(${x},${y}) scale(${s})` }, g); U.el('path', { d: 'M-22 30 V-30 Q0 -48 22 -30 V30 M-30 0 H30 V10 H-30 Z M-26 30 V44 M26 30 V44', fill: col, stroke: '#4A2C10', 'stroke-width': 4, 'stroke-linejoin': 'round' }, tg); return tg; };
    const centro = trono(cx, cy, 2.4, '#E7B84E');
    const n = d.cantidad || 24;
    const T = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i / n * Math.PI * 2; return { g: trono(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 0.9, '#F2E3BE'), a, t: (d.tTronos ?? 0.8) + i * 0.06 }; });
    const coronas = T.map(tr => APE.icono(g, 'corona', cx + Math.cos(tr.a) * R, cy + Math.sin(tr.a) * R - 52, 40, '#D9A640'));
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: cx, y: H / 2, s: 1.15 }, { t: b.dur + 0.7, x: cx, y: H / 2, s: 0.96 }]);
    return {
      cajaTexto: Object.assign(APE.cajaTexto(ctx, 'abajo'), vertical ? {} : { y: H * 0.91, size: 66 }),
      update(t) {
        cam(t);
        centro.setAttribute('transform', `translate(${cx},${cy}) scale(${2.4 * U.back(U.p(t, 0.1, 0.6))})`);
        aro.setAttribute('transform', `rotate(${t * 4},${cx},${cy})`);
        T.forEach((tr, i) => {
          const q = U.back(U.p(t, tr.t, tr.t + 0.4)); const x = cx + Math.cos(tr.a + t * 0.03) * R, y = cy + Math.sin(tr.a + t * 0.03) * R;
          tr.g.setAttribute('transform', `translate(${x},${y}) scale(${0.9 * Math.max(q, 0.001)})`);
          const caer = d.tCoronas != null ? U.eio(U.p(t, d.tCoronas + i * 0.03, d.tCoronas + 0.8 + i * 0.03)) : 0;
          coronas[i].setAttribute('transform', `translate(${(x - 20) + (cx - x) * caer * 0.7},${(y - 72) + (cy - y) * caer * 0.7}) scale(${40 / 24 * Math.max(q, 0.001)})`);
          coronas[i].setAttribute('opacity', U.p(t, tr.t + 0.3, tr.t + 0.5));
        });
      },
    };
  };
})();
