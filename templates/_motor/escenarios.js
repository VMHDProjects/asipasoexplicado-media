/* Escenarios ilustrados que se construyen pieza por pieza (con parallax).
   Presets: pueblo, campo, puerto, desierto, ciudad_antigua. Colores en tema.escenario. */
(function () {
  const { U } = APE;

  function nube(g, x, y, k, col) {
    const n = U.el('g', {}, g);
    [[0, 0, 46], [44, -18, 56], [96, -4, 44], [56, 12, 40], [-30, 10, 30]].forEach(([a, b, r]) => U.el('circle', { cx: x + a * k, cy: y + b * k, r: r * k, fill: col }, n));
    return n;
  }
  function palmera(g, x, base, h, E, ink) {
    const pg = U.el('g', {}, g);
    U.el('path', { d: `M${x} ${base} C ${x + 12} ${base - h * 0.4} ${x - 18} ${base - h * 0.7} ${x + 10} ${base - h}`, stroke: E.tronco || '#6b4a2f', 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, pg);
    const copa = U.el('g', {}, pg);
    const tx = x + 10, ty = base - h;
    [-160, -125, -90, -55, -20, 10, -195].forEach(a => {
      const r = a * Math.PI / 180, L = h * 0.42;
      const ex = tx + Math.cos(r) * L, ey = ty + Math.sin(r) * L + L * 0.35;
      const mx = tx + Math.cos(r) * L * 0.5, my = ty + Math.sin(r) * L * 0.5 - 20;
      U.el('path', { d: `M${tx} ${ty} Q${mx} ${my - 14} ${ex} ${ey} Q${mx} ${my + 14} ${tx} ${ty} Z`, fill: E.hojas || '#2f6b3a', stroke: ink, 'stroke-width': 2 }, copa);
    });
    return { g: pg, copa, tx, ty };
  }
  function casa(g, x, base, w, h, col, E, ink, r, plano) {
    const c = U.el('g', {}, g);
    U.el('rect', { x, y: base - h, width: w, height: h, fill: col, stroke: ink, 'stroke-width': 3 }, c);
    U.el('rect', { x, y: base - h, width: w * 0.18, height: h, fill: '#000', opacity: 0.12 }, c);
    if (plano) {
      U.el('rect', { x: x - 8, y: base - h - 18, width: w + 16, height: 22, fill: U.claro(col, 0.25), stroke: ink, 'stroke-width': 3 }, c);
    } else {
      U.el('path', { d: `M${x - 14} ${base - h} L${x + w * 0.5} ${base - h - h * 0.34} L${x + w + 14} ${base - h} Z`, fill: E.tejado || '#9b3b2b', stroke: ink, 'stroke-width': 3 }, c);
      for (let k = 1; k < 5; k++) U.el('line', { x1: x - 14 + k * (w + 28) / 5, y1: base - h, x2: x + w * 0.5, y2: base - h - h * 0.34, stroke: ink, 'stroke-width': 1.5, opacity: 0.4 }, c);
    }
    const dw = w * 0.22, dh = h * 0.42;
    U.el('path', { d: `M${x + w / 2 - dw / 2} ${base} V${base - dh + dw / 2} A${dw / 2} ${dw / 2} 0 0 1 ${x + w / 2 + dw / 2} ${base - dh + dw / 2} V${base} Z`, fill: E.puerta || '#3b2418', stroke: ink, 'stroke-width': 2.5 }, c);
    const pisos = h > 210 ? 2 : 1;
    for (let p = 0; p < pisos; p++) {
      const wy = base - h + 30 + p * (h * 0.4);
      [x + w * 0.1, x + w * 0.72].forEach(wx => {
        if (p === 0 && pisos === 1 && false) return;
        U.el('rect', { x: wx, y: wy, width: w * 0.18, height: h * 0.22, fill: E.ventana || '#f4d58d', stroke: ink, 'stroke-width': 2.5 }, c);
        U.el('rect', { x: wx - w * 0.07, y: wy, width: w * 0.07, height: h * 0.22, fill: E.persiana || '#2f6b5a', stroke: ink, 'stroke-width': 2 }, c);
      });
      if (p === 1 || pisos === 1) U.el('line', { x1: x, y1: wy + h * 0.25, x2: x + w, y2: wy + h * 0.25, stroke: ink, 'stroke-width': 3 }, c);
    }
    return c;
  }

  const PRESETS = {
    pueblo(ctx, L, E, ink, r) {
      const { W, H, vertical } = ctx, hz = L.hz, k = L.k;
      const lejos = U.el('g', {}, L.capa(0.15));
      U.el('path', { d: `M${-W * 0.4} ${hz} Q${W * 0.0} ${hz - 190 * k} ${W * 0.35} ${hz - 90 * k} T${W * 1.0} ${hz - 140 * k} T${W * 1.5} ${hz - 60 * k} V${hz + 10} H${-W * 0.4} Z`, fill: E.lejos }, lejos);
      L.pieza(lejos, 0.0, 'abajo', hz);
      const suelo = U.el('g', {}, L.capa(0.5));
      U.el('rect', { x: -W, y: hz, width: W * 3, height: H, fill: E.tierra }, suelo);
      for (let i = -6; i <= 6; i++) U.el('line', { x1: W / 2 + i * 60, y1: hz, x2: W / 2 + i * 420, y2: H, stroke: ink, 'stroke-width': 2, opacity: 0.18 }, suelo);
      const casas = U.el('g', {}, L.capa(0.5));
      const cols = E.casas;
      const items = [];
      let x = -W * 0.32; let n = 0;
      while (x < W * 1.32) {
        const w = (190 + r() * 110) * k, h = (170 + r() * 110) * k;
        const centro = Math.abs(x + w / 2 - W / 2) < 170 * k && !items.iglesia;
        if (centro) {
          const ig = U.el('g', {}, casas);
          const iw = 270 * k, ih = 300 * k;
          casa(ig, x, hz, iw, ih, E.iglesia || '#e9dcc0', E, ink, r, true);
          U.el('rect', { x: x + iw * 0.32, y: hz - ih - 240 * k, width: iw * 0.36, height: 240 * k, fill: E.iglesia || '#e9dcc0', stroke: ink, 'stroke-width': 3 }, ig);
          U.el('path', { d: `M${x + iw * 0.5 - 18 * k} ${hz - ih - 150 * k} v${-50 * k} a${18 * k} ${18 * k} 0 0 1 ${36 * k} 0 v${50 * k} Z`, fill: '#2a1d16', stroke: ink, 'stroke-width': 2 }, ig);
          U.el('path', { d: `M${x + iw * 0.5} ${hz - ih - 300 * k} v${60 * k} M${x + iw * 0.5 - 20 * k} ${hz - ih - 280 * k} h${40 * k}`, stroke: ink, 'stroke-width': 6 * k }, ig);
          items.iglesia = true;
          items.push({ g: ig, x: x + iw / 2 });
          x += iw + 10 * k;
        } else {
          items.push({ g: casa(casas, x, hz, w, h, cols[n % cols.length], E, ink, r, r() < 0.5), x: x + w / 2 });
          x += w + (6 + r() * 26) * k; n++;
        }
      }
      items.sort((a, b) => Math.abs(a.x - W / 2) - Math.abs(b.x - W / 2)).forEach((it, i) => L.pieza(it.g, 0.12 + i * 0.07, 'abajo', hz));
      const frente = L.capa(0.85);
      [-0.05, 0.3, 0.78, 1.1].forEach((f, i) => { const pm = palmera(frente, W * f, hz + 40 * k, (330 + r() * 80) * k, E, ink); L.pieza(pm.g, 0.6 + i * 0.12, 'abajo', hz + 40 * k); L.mecer(pm.copa, pm.tx, pm.ty, i); });
      [[W * 0.16, 1], [W * 0.62, -1], [W * 0.9, 1]].forEach(([fx, dir], i) => L.caminante(frente, fx, hz + 70 * k, 120 * k, dir, i));
    },
    campo(ctx, L, E, ink, r) {
      const { W, H } = ctx, hz = L.hz, k = L.k;
      const m = U.el('g', {}, L.capa(0.1));
      U.el('path', { d: `M${-W * 0.4} ${hz} L${W * 0.1} ${hz - 300 * k} L${W * 0.35} ${hz - 160 * k} L${W * 0.6} ${hz - 340 * k} L${W * 1.0} ${hz - 120 * k} L${W * 1.5} ${hz - 260 * k} V${hz} Z`, fill: E.lejos }, m);
      L.pieza(m, 0, 'abajo', hz);
      const lom = U.el('g', {}, L.capa(0.35));
      U.el('path', { d: `M${-W * 0.4} ${hz + 20} Q${W * 0.2} ${hz - 120 * k} ${W * 0.6} ${hz - 20 * k} T${W * 1.5} ${hz - 60 * k} V${H * 1.2} H${-W * 0.4} Z`, fill: E.medio || U.oscuro(E.tierra, -0.1) }, lom);
      L.pieza(lom, 0.15, 'abajo', hz + 20);
      const suelo = U.el('g', {}, L.capa(0.55));
      U.el('rect', { x: -W, y: hz + 60 * k, width: W * 3, height: H, fill: E.tierra }, suelo);
      const cana = U.el('g', {}, L.capa(0.6));
      for (let f = 0; f < 3; f++) for (let x = -W * 0.3; x < W * 1.3; x += 26 * k) {
        const by = hz + (90 + f * 70) * k, h = (90 + r() * 60) * k;
        const c = U.el('path', { d: `M${x} ${by} q${(r() - 0.5) * 20} ${-h / 2} ${(r() - 0.5) * 30} ${-h}`, stroke: E.hojas, 'stroke-width': 6 * k, fill: 'none', 'stroke-linecap': 'round' }, cana);
        L.pieza(c, 0.35 + f * 0.15 + Math.abs(x - W / 2) / W * 0.4, 'abajo', by);
      }
      const bohio = U.el('g', {}, L.capa(0.5));
      const bx = W * 0.62, bw = 260 * k, bh = 150 * k, by = hz + 40 * k;
      U.el('rect', { x: bx, y: by - bh, width: bw, height: bh, fill: E.casas[0], stroke: ink, 'stroke-width': 3 }, bohio);
      U.el('path', { d: `M${bx - 40 * k} ${by - bh + 10} L${bx + bw / 2} ${by - bh - 120 * k} L${bx + bw + 40 * k} ${by - bh + 10} Z`, fill: E.paja || '#b88b4a', stroke: ink, 'stroke-width': 3 }, bohio);
      U.el('rect', { x: bx + bw * 0.4, y: by - bh * 0.6, width: bw * 0.2, height: bh * 0.6, fill: E.puerta, stroke: ink, 'stroke-width': 2 }, bohio);
      L.pieza(bohio, 0.5, 'abajo', by);
      const frente = L.capa(0.85);
      [0.08, 0.92].forEach((f, i) => { const pm = palmera(frente, W * f, hz + 220 * k, 420 * k, E, ink); L.pieza(pm.g, 0.7 + i * 0.15, 'abajo', hz + 220 * k); L.mecer(pm.copa, pm.tx, pm.ty, i); });
      L.caminante(frente, W * 0.3, hz + 200 * k, 130 * k, 1, 0);
    },
    puerto(ctx, L, E, ink, r) {
      const { W, H } = ctx, hz = L.hz, k = L.k;
      const mar = U.el('g', {}, L.capa(0.3));
      U.el('rect', { x: -W, y: hz, width: W * 3, height: H, fill: E.mar || '#2b5876' }, mar);
      L.olas = [];
      for (let f = 0; f < 6; f++) { const o = U.el('path', { fill: 'none', stroke: '#ffffff', 'stroke-width': 3, opacity: 0.35 }, mar); L.olas.push({ o, y: hz + 30 * k + f * 60 * k, f }); }
      const fuerte = U.el('g', {}, L.capa(0.45));
      const fx = -W * 0.2, fw = W * 0.5, fh = 200 * k;
      let dd = `M${fx} ${hz + 30} V${hz - fh}`;
      for (let x = fx; x < fx + fw; x += 50 * k) dd += ` h${25 * k} v${-30 * k} h${25 * k} v${30 * k}`;
      dd += ` V${hz + 30} Z`;
      U.el('path', { d: dd, fill: E.piedra || '#b9a27e', stroke: ink, 'stroke-width': 3 }, fuerte);
      U.el('rect', { x: fx + fw * 0.6, y: hz - fh - 160 * k, width: 110 * k, height: 160 * k, fill: E.piedra || '#b9a27e', stroke: ink, 'stroke-width': 3 }, fuerte);
      L.pieza(fuerte, 0.1, 'abajo', hz + 30);
      const barco = U.el('g', {}, L.capa(0.6));
      const bx = W * 0.62, by = hz + 90 * k;
      U.el('path', { d: `M${bx - 200 * k} ${by - 60 * k} L${bx + 220 * k} ${by - 60 * k} L${bx + 160 * k} ${by} L${bx - 160 * k} ${by} Z`, fill: E.casco || '#4a2c1d', stroke: ink, 'stroke-width': 3 }, barco);
      const velas = [];
      [-90, 40, 150].forEach((dx, i) => {
        U.el('line', { x1: bx + dx * k, y1: by - 60 * k, x2: bx + dx * k, y2: by - (360 - i * 40) * k, stroke: ink, 'stroke-width': 5 }, barco);
        velas.push({ e: U.el('path', { fill: E.vela || '#efe6d2', stroke: ink, 'stroke-width': 2.5 }, barco), x: bx + dx * k, top: by - (340 - i * 40) * k, bot: by - 90 * k, w: (90 - i * 10) * k });
      });
      L.velas = velas;
      L.pieza(barco, 0.45, 'abajo', by);
      L.balanceo = { g: barco, x: bx, y: by };
    },
    desierto(ctx, L, E, ink, r) {
      const { W, H } = ctx, hz = L.hz, k = L.k;
      [[0.12, E.lejos, -120], [0.3, E.medio || U.mix(E.lejos, E.tierra, 0.5), -40], [0.55, E.tierra, 40]].forEach(([dep, col, off], i) => {
        const g = U.el('g', {}, L.capa(dep));
        U.el('path', { d: `M${-W * 0.5} ${hz + off * k} Q${W * 0.0} ${hz + (off - 150) * k} ${W * 0.4} ${hz + (off - 30) * k} T${W * 1.1} ${hz + (off - 70) * k} T${W * 1.6} ${hz + off * k} V${H * 1.3} H${-W * 0.5} Z`, fill: col }, g);
        L.pieza(g, i * 0.18, 'abajo', hz + off * k);
      });
      const tiendas = U.el('g', {}, L.capa(0.55));
      [[0.25, 1], [0.42, 0.8], [0.7, 1.1]].forEach(([f, s], i) => {
        const tx = W * f, ty = hz + 70 * k, tw = 240 * k * s, th = 150 * k * s;
        const tg = U.el('g', {}, tiendas);
        U.el('path', { d: `M${tx - tw / 2} ${ty} L${tx} ${ty - th} L${tx + tw / 2} ${ty} Z`, fill: E.casas[i % E.casas.length], stroke: ink, 'stroke-width': 3 }, tg);
        U.el('path', { d: `M${tx} ${ty - th} L${tx - tw * 0.12} ${ty} L${tx + tw * 0.12} ${ty} Z`, fill: '#2a1a10', opacity: 0.75 }, tg);
        for (let s2 = 1; s2 < 4; s2++) U.el('line', { x1: tx - tw / 2 + s2 * tw / 8, y1: ty - s2 * th / 4, x2: tx + tw / 2 - s2 * tw / 8, y2: ty - s2 * th / 4, stroke: ink, 'stroke-width': 1.6, opacity: 0.35 }, tg);
        L.pieza(tg, 0.45 + i * 0.12, 'abajo', ty);
      });
      const frente = L.capa(0.85);
      const pm = palmera(frente, W * 0.9, hz + 200 * k, 400 * k, E, ink); L.pieza(pm.g, 0.8, 'abajo', hz + 200 * k); L.mecer(pm.copa, pm.tx, pm.ty, 1);
      [[W * 0.12, 1], [W * 0.55, -1]].forEach(([fx, dir], i) => L.caminante(frente, fx, hz + 190 * k, 140 * k, dir, i, 'tunica'));
    },
    ciudad_antigua(ctx, L, E, ink, r) {
      const { W, H } = ctx, hz = L.hz, k = L.k;
      const m = U.el('g', {}, L.capa(0.12));
      U.el('path', { d: `M${-W * 0.4} ${hz} Q${W * 0.3} ${hz - 260 * k} ${W * 0.7} ${hz - 120 * k} T${W * 1.5} ${hz - 180 * k} V${hz} Z`, fill: E.lejos }, m);
      L.pieza(m, 0, 'abajo', hz);
      const suelo = U.el('g', {}, L.capa(0.5));
      U.el('rect', { x: -W, y: hz, width: W * 3, height: H, fill: E.tierra }, suelo);
      const muro = U.el('g', {}, L.capa(0.45));
      let dd = `M${-W * 0.3} ${hz} V${hz - 120 * k}`;
      for (let x = -W * 0.3; x < W * 1.3; x += 44 * k) dd += ` h${22 * k} v${-22 * k} h${22 * k} v${22 * k}`;
      dd += ` V${hz} Z`;
      U.el('path', { d: dd, fill: E.piedra || '#c9ad80', stroke: ink, 'stroke-width': 3 }, muro);
      L.pieza(muro, 0.1, 'abajo', hz);
      const casas = U.el('g', {}, L.capa(0.5));
      const items = [];
      for (let x = -W * 0.25; x < W * 1.25;) {
        const w = (130 + r() * 120) * k, h = (150 + r() * 160) * k;
        const c = U.el('g', {}, casas);
        U.el('rect', { x, y: hz - h, width: w, height: h, fill: E.casas[items.length % E.casas.length], stroke: ink, 'stroke-width': 3 }, c);
        U.el('rect', { x: x - 6, y: hz - h - 12, width: w + 12, height: 14, fill: U.oscuro(E.casas[items.length % E.casas.length], 0.15), stroke: ink, 'stroke-width': 2 }, c);
        U.el('rect', { x: x + w * 0.4, y: hz - h * 0.4, width: w * 0.2, height: h * 0.4, fill: '#2a1a10' }, c);
        U.el('rect', { x: x + w * 0.2, y: hz - h * 0.8, width: w * 0.14, height: w * 0.14, fill: '#2a1a10' }, c);
        items.push({ g: c, x: x + w / 2 }); x += w + 8 * k;
      }
      items.sort((a, b) => Math.abs(a.x - W / 2) - Math.abs(b.x - W / 2)).forEach((it, i) => L.pieza(it.g, 0.2 + i * 0.06, 'abajo', hz));
      const frente = L.capa(0.85);
      [[W * 0.2, 1], [W * 0.75, -1], [W * 0.45, 1]].forEach(([fx, dir], i) => L.caminante(frente, fx, hz + 120 * k, 130 * k, dir, i, 'tunica'));
    },
  };

  APE.escenas.escenario = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx;
    const E = Object.assign({}, tema.escenario, d.colores || {});
    const ink = E.tinta || '#1a1210';
    const r = U.rnd(d.semilla || 3);
    const hz = vertical ? H * 0.6 : H * 0.72, k = vertical ? 1.15 : 1;
    // cielo (sin parallax)
    const gid = U.uid('cielo'); const lg = U.el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, ctx.defs);
    U.el('stop', { offset: 0, 'stop-color': E.cielo[0] }, lg); U.el('stop', { offset: 1, 'stop-color': E.cielo[1] }, lg);
    const cielo = U.el('g', {}, b.cam);
    U.el('rect', { x: -W, y: -H, width: W * 3, height: H * 3, fill: `url(#${gid})` }, cielo);
    const sol = U.el('g', {}, cielo);
    const sx = W * (d.sol ?? 0.72), sy = hz - (vertical ? 560 : 430);
    U.el('circle', { cx: sx, cy: sy, r: 160, fill: E.sol, opacity: 0.25, filter: 'url(#ape-blur30)' }, sol);
    U.el('circle', { cx: sx, cy: sy, r: 80, fill: E.sol }, sol);
    const nubes = [0.1, 0.45, 0.8, 1.15].map((f, i) => ({ g: nube(cielo, W * f, hz - (vertical ? 700 : 520) + i % 2 * 70, 1 + (i % 3) * 0.3, E.nube || '#ffffff'), v: 10 + i * 4 }));
    nubes.forEach(n => n.g.setAttribute('opacity', 0.75));
    const pajaros = [0, 1, 2].map(i => U.el('path', { fill: 'none', stroke: ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, cielo));
    const capas = [], piezas = [], mecen = [], caminan = [];
    const L = {
      hz, k,
      capa(dep) { const g = U.el('g', {}, b.cam); capas.push({ g, dep }); return g; },
      pieza(g, t0, modo, base) { piezas.push({ g, t0, base }); },
      mecer(g, x, y, i) { mecen.push({ g, x, y, i }); },
      caminante(par, x, y, h, dir, i, tipo) { const s = APE.silueta(par, 0, 0, h, E.silueta || ink, tipo || 'sombrero', i); caminan.push({ s, x, y, dir, i }); },
    };
    (PRESETS[d.preset] || PRESETS.pueblo)(ctx, L, E, ink, r);
    const pan = (d.paneo ?? 1) * (vertical ? 140 : 180);
    const keys = d.camara || [{ t: 0, x: W / 2 - pan * 0.5, y: H / 2, s: 1.02 }, { t: b.dur + 0.6, x: W / 2 + pan * 0.5, y: H / 2 - 20, s: 1.1 }];
    const cam = APE.camara(b.cam, ctx, keys, 0.6);
    const caja = APE.cajaTexto(ctx, d.zonaTexto || (vertical ? 'abajo' : 'arriba'));
    if (vertical && !d.zonaTexto) caja.y = H * 0.8;
    return {
      cajaTexto: caja,
      update(t) {
        cam(t);
        const px = U.lerp(-1, 1, U.p(t, 0, b.dur + 0.6)) * pan;
        capas.forEach(c => c.g.setAttribute('transform', `translate(${-px * (c.dep - 0.5) * 1.6},0)`));
        piezas.forEach(p => {
          const q = U.p(t, p.t0, p.t0 + 0.55);
          U.show(p.g, q > 0);
          if (q > 0 && q < 1) p.g.setAttribute('transform', U.sAt(W / 2, p.base, 1, U.back(q)));
          else if (q >= 1) p.g.removeAttribute('transform');
        });
        mecen.forEach(m => m.g.setAttribute('transform', `rotate(${U.wob(t, 1.3, m.i * 2) * 4},${m.x},${m.y})`));
        caminan.forEach(c => {
          const q = U.eo(U.p(t, 0.9 + c.i * 0.2, 1.4 + c.i * 0.2));
          const x = c.x + c.dir * t * 38 * k, y = c.y - Math.abs(Math.sin(t * 6 + c.i)) * 4;
          c.s.g.setAttribute('transform', `translate(${x},${y}) scale(${c.dir},1)`);
          c.s.g.setAttribute('opacity', q);
        });
        nubes.forEach(n => n.g.setAttribute('transform', `translate(${t * n.v},0)`));
        sol.setAttribute('transform', `translate(0,${(1 - U.eo(U.p(t, 0, 1.2))) * 120})`);
        pajaros.forEach((p, i) => {
          const bx = W * 0.2 + ((t * (60 + i * 14) + i * 140) % (W * 0.9)), by = hz - (vertical ? 820 : 640) + i * 40 + Math.sin(t * 2 + i) * 10;
          const a = Math.sin(t * 9 + i * 2) * 10;
          p.setAttribute('d', `M${bx - 18} ${by - a} Q${bx - 8} ${by - 6} ${bx} ${by} Q${bx + 8} ${by - 6} ${bx + 18} ${by - a}`);
        });
        if (L.olas) L.olas.forEach(o => { let dd = ''; for (let x = -W; x < W * 2; x += 60) dd += `M${x + ((t * 30 + o.f * 20) % 60)} ${o.y} q15 -8 30 0 `; o.o.setAttribute('d', dd); });
        if (L.velas) L.velas.forEach((v, i) => { const inf = 0.4 + 0.6 * U.eo(U.p(t, 0.9 + i * 0.15, 1.8 + i * 0.15)) + Math.sin(t * 2 + i) * 0.06; v.e.setAttribute('d', `M${v.x} ${v.top} Q${v.x + v.w * 1.6 * inf} ${(v.top + v.bot) / 2} ${v.x} ${v.bot} Z`); });
        if (L.balanceo) L.balanceo.g.setAttribute('transform', `rotate(${Math.sin(t * 1.2) * 2},${L.balanceo.x},${L.balanceo.y}) translate(0,${Math.sin(t * 1.5) * 6})`);
      },
    };
  };
})();
