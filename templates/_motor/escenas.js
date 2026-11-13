/* Tipos de escena comunes a las 4 series. Cada tema decide colores, fuentes, marcos y transición. */
(function () {
  const { U, Texto } = APE;

  // ---------- íconos (24×24) ----------
  APE.iconos = {
    compartir: 'M14 4l7 7-7 7v-4c-5 0-8.5 1.5-11 5 1-5 4-10 11-11z',
    corazon: 'M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z',
    comentario: 'M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4v-4H4a2 2 0 01-2-2V6a2 2 0 012-2z',
    campana: 'M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5-6.7V3a2 2 0 10-4 0v1.3A7 7 0 005 11v5l-2 2v1h18v-1z',
    mas: 'M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z',
    check: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
    x: 'M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z',
    reloj: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z',
    alerta: 'M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z',
    estrella: 'M12 2l3 7h7l-5.6 4.3L18.5 21 12 16.8 5.5 21l2.1-7.7L2 9h7z',
    play: 'M8 5v14l11-7z',
    gota: 'M12 2s7 8 7 13a7 7 0 01-14 0c0-5 7-13 7-13z',
    rayo: 'M13 2L4 14h7l-1 8 9-12h-7z',
    luna: 'M20 15.5A9 9 0 118.5 4a7 7 0 0011.5 11.5z',
    sol: 'M12 7a5 5 0 100 10 5 5 0 000-10zM11 1h2v3h-2zm0 19h2v3h-2zM1 11h3v2H1zm19 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1l1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zM16.3 6.3l2.1-2.1 1.4 1.4-2.1 2.1z',
    libro: 'M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zm16 0h-4a3 3 0 00-3 3v13a2 2 0 012-2h5z',
    corona: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
    espada: 'M19 2l3 3-11 11-2-1-1-2zM6 15l3 3-3 3-3-3z',
    escudo: 'M12 2l8 3v6c0 5-3.4 9.7-8 11-4.6-1.3-8-6-8-11V5z',
    fuego: 'M12 2c1 4 6 6 6 12a6 6 0 01-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z',
    cerebro: 'M9 3a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 001 5 3 3 0 004 3h2V3zm6 0a3 3 0 013 3 3 3 0 012 5 3 3 0 01-1 5 3 3 0 01-4 3h-2V3z',
    corazonOrg: 'M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z',
  };
  APE.icono = (parent, nombre, x, y, size, fill) => U.el('path', { d: APE.iconos[nombre] || APE.iconos.estrella, fill, transform: `translate(${x - size / 2},${y - size / 2}) scale(${size / 24})` }, parent);

  // ---------- titular: frase grande con fondo vivo ----------
  APE.escenas.titular = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const g = U.el('g', {}, b.cam);
    const fondo = U.el('text', { x: W / 2, y: H / 2 + (vertical ? 260 : 210), 'text-anchor': 'middle', 'font-family': tema.fuentes.titulo, 'font-weight': 700, 'font-size': vertical ? 520 : 640, fill: 'none', stroke: C.tinta, 'stroke-width': 3, opacity: 0.13 }, g);
    fondo.textContent = d.fondo || '';
    const lineas = [0, 1, 2, 3].map(i => U.el('line', { stroke: i % 2 ? C.acento : C.tinta, 'stroke-width': i % 2 ? 10 : 3, opacity: i % 2 ? 0.9 : 0.4, pathLength: 1 }, g));
    const decor = tema.decorTitular ? tema.decorTitular(ctx, g, d) : null;
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: W / 2, y: H / 2, s: 1.12 }, { t: b.dur + 0.6, x: W / 2, y: H / 2, s: 1.0 }]);
    return {
      cajaTexto: APE.cajaTexto(ctx, 'centro'),
      update(t) {
        cam(t);
        fondo.setAttribute('transform', `translate(${(t - b.dur / 2) * -40},0)`);
        fondo.setAttribute('opacity', 0.13 * U.eo(U.p(t, 0, 0.8)));
        lineas.forEach((l, i) => {
          const y = vertical ? H * (0.32 + i * 0.12) : H * (0.18 + i * 0.22);
          const L = vertical ? W * 0.7 : W * 0.5;
          const x = ((i % 2 ? -1 : 1) * t * 60 + i * 300) % (W * 0.6) + W * 0.1;
          const yy = i < 2 ? (vertical ? H * 0.3 : H * 0.2) - i * 18 : (vertical ? H * 0.66 : H * 0.8) + (i - 2) * 18;
          l.setAttribute('x1', x); l.setAttribute('x2', x + L * 0.5); l.setAttribute('y1', yy); l.setAttribute('y2', yy);
          U.trazo(l, U.eo(U.p(t, 0.1 + i * 0.1, 0.7 + i * 0.1)));
        });
        if (decor) decor(t, b.dur);
      },
    };
  };

  // ---------- retrato ----------
  APE.escenas.retrato = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const def = Object.assign({ nombre: d.personaje }, ctx.personajes[d.personaje] || {});
    const dos = d.personaje2 ? Object.assign({ nombre: d.personaje2 }, ctx.personajes[d.personaje2] || {}) : null;
    const g = U.el('g', {}, b.cam);
    const R = dos ? (vertical ? 260 : 290) : (vertical ? 380 : 360);
    const cx = vertical ? W / 2 : (dos ? W * 0.52 : W * 0.7), cy = vertical ? (dos ? H * 0.23 : H * 0.34) : H * 0.48;
    const marcoF = APE.marcos[d.marco || tema.marcoRetrato || 'medallon'];
    const m1 = marcoF(ctx, g, cx, cy, R, def, d);
    let m2 = null, def2 = dos;
    if (dos) {
      const c2x = vertical ? W / 2 : W * 0.8, c2y = vertical ? H * 0.49 : H * 0.48;
      m2 = marcoF(ctx, g, c2x, c2y, R, def2, Object.assign({}, d, { etiqueta: d.etiqueta2 }));
    }
    const tc = d.tCambio ?? b.dur * 0.5;
    const z = 1 + (d.zoom ?? 0.16);
    const fx = vertical ? W / 2 : (dos ? W / 2 + (cx - W / 2) * 0.4 : cx - R * 0.9), fy = vertical ? cy + (H / 2 - cy) / z + 70 : H / 2 - R * 0.1;
    const keys = dos ? [{ t: 0, x: W / 2, y: H / 2, s: 1.0 }] : [{ t: 0, x: W / 2, y: H / 2 + 20, s: 1.0 }, { t: Math.max(tc, 0.5), x: fx, y: fy, s: z }];
    if (false) { const t2 = d.t2 ?? tc; keys.push({ t: t2 + 0.01, x: fx, y: fy, s: z }, { t: t2 + 0.9, x: W / 2 + (vertical ? 0 : W * 0.05), y: H / 2, s: 0.96 }); }
    const kl = keys[keys.length - 1];
    keys.push({ t: b.dur + 0.6, x: kl.x, y: kl.y, s: kl.s * 1.06 });
    const cam = APE.camara(b.cam, ctx, keys);
    const caja = vertical ? { x: W / 2, y: H * 0.72, w: W * 0.86, size: 96 * (tema.tamTexto || 1), anchor: 'middle', vAnchor: 'middle' }
      : { x: 110, y: H * 0.5, w: dos ? W * 0.25 : W * 0.36, size: (dos ? 82 : 100) * (tema.tamTexto || 1), anchor: 'start', vAnchor: 'middle' };
    return {
      cajaTexto: caja,
      update(t) {
        cam(t);
        m1.update(t, 0);
        if (m2) { const t2 = d.t2 ?? tc; U.show(m2.g, t >= t2); if (t >= t2) m2.update(t - t2, 0); }
      },
    };
  };

  // marcos para retratos
  APE.marcos = {
    medallon(ctx, parent, cx, cy, R, def, d) {
      const C = ctx.tema.colores;
      const g = U.el('g', {}, parent);
      const cid = U.uid('med'); const cp = U.el('clipPath', { id: cid }, ctx.defs); const clipC = U.el('circle', { cx, cy, r: R }, cp);
      const fondo = U.el('g', { 'clip-path': `url(#${cid})` }, g);
      U.el('circle', { cx, cy, r: R, fill: C.fondoRetrato || U.claro(C.fondo, 0.08) }, fondo);
      const rayas = U.el('g', {}, fondo);
      for (let i = -14; i <= 14; i++) U.el('line', { x1: cx + i * 46 - R, y1: cy - R * 1.5, x2: cx + i * 46 + R, y2: cy + R * 1.5, stroke: C.rayasRetrato || C.tinta, 'stroke-width': 2, opacity: 0.08 }, rayas);
      const luz = U.el('circle', { cx: cx + R * 0.3, cy: cy - R * 0.3, r: R * 0.8, fill: C.acento, opacity: 0.18, filter: 'url(#ape-blur30)' }, fondo);
      const per = U.el('g', {}, fondo);
      const rt = APE.retrato(per, ctx, def);
      const esc = R * 2 / 500 * 1.06;
      const anillo = U.el('circle', { cx, cy, r: R, fill: 'none', stroke: C.acento, 'stroke-width': 12, pathLength: 1, transform: `rotate(-90,${cx},${cy})` }, g);
      const anillo2 = U.el('circle', { cx, cy, r: R + 22, fill: 'none', stroke: C.tinta, 'stroke-width': 2.5, opacity: 0.6, 'stroke-dasharray': '6 14' }, g);
      const etq = d.etiqueta !== false ? (d.etiqueta || def.etiqueta || def.nombreCompleto) : null;
      let cinta = null;
      if (etq) {
        cinta = U.el('g', {}, g);
        const fs = ctx.vertical ? 44 : 40;
        const te = U.el('text', { x: cx, y: cy + R + 18 + fs * 0.35, 'text-anchor': 'middle', 'font-family': ctx.tema.fuentes.texto, 'font-weight': 700, 'font-size': fs, fill: C.sobreAcento || '#fff', 'letter-spacing': 3 }, cinta);
        te.textContent = String(etq).toLocaleUpperCase('es');
        const w = te.getComputedTextLength() + 70;
        const rc = U.el('path', { d: `M${cx - w / 2} ${cy + R - 18} h${w} l-18 ${36} l18 ${36} h${-w} l18 ${-36} Z`, fill: C.acento, transform: `translate(0,${-fs * 0.42 + 14})` }, cinta);
        cinta.insertBefore(rc, te);
      }
      return {
        g,
        update(t) {
          const q = U.eoq(U.p(t, 0, 0.7));
          clipC.setAttribute('r', R * q);
          U.trazo(anillo, U.eo(U.p(t, 0.1, 0.9)));
          anillo2.setAttribute('transform', `rotate(${t * 8},${cx},${cy})`);
          anillo2.setAttribute('opacity', 0.6 * U.p(t, 0.4, 0.9));
          rayas.setAttribute('transform', `translate(${(t * 14) % 46},0)`);
          luz.setAttribute('transform', `translate(${Math.sin(t * 0.8) * 40},${Math.cos(t * 0.6) * 30})`);
          const sub = (1 - U.eo(U.p(t, 0.1, 1.0))) * 120;
          per.setAttribute('transform', `translate(${cx - 200 * esc},${cy + R + 6 - 500 * esc + sub}) scale(${esc})`);
          rt.update(t, { dibujo: U.p(t, 0.05, 1.4) });
          if (cinta) { const qc = U.back(U.p(t, 0.7, 1.15)); cinta.setAttribute('transform', U.sAt(cx, cy + R, Math.max(qc, 0.001), 1)); cinta.setAttribute('opacity', U.p(t, 0.7, 0.8)); }
        },
      };
    },
  };

  // ---------- línea de tiempo ----------
  APE.escenas.linea_tiempo = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const g = U.el('g', {}, b.cam);
    const hitos = d.hitos || [];
    const sp = vertical ? 620 : 620, y = vertical ? H * 0.45 : H * 0.5;
    const x0 = 0;
    const eje = U.el('line', { x1: x0 - sp, y1: y, x2: x0 + sp * hitos.length, y2: y, stroke: C.tinta, 'stroke-width': 6, opacity: 0.85, pathLength: 1 }, g);
    const ticks = U.el('g', { opacity: 0.4 }, g);
    for (let x = x0 - sp; x < x0 + sp * hitos.length; x += sp / 8) U.el('line', { x1: x, y1: y - 12, x2: x, y2: y + 12, stroke: C.tinta, 'stroke-width': 2 }, ticks);
    const fsY = vertical ? 170 : 150;
    const H2 = hitos.map((h, i) => {
      const x = x0 + i * sp;
      const hg = U.el('g', {}, g);
      const halo = U.el('circle', { cx: x, cy: y, r: 30, fill: C.acento, opacity: 0.3 }, hg);
      const nodo = U.el('circle', { cx: x, cy: y, r: 22, fill: C.acento, stroke: C.tinta, 'stroke-width': 5 }, hg);
      const anio = U.el('text', { x, y: y - 60, 'text-anchor': 'middle', 'font-family': tema.fuentes.serif || tema.fuentes.titulo, 'font-weight': 700, 'font-size': fsY, fill: C.tinta }, hg);
      const conector = U.el('line', { x1: x, y1: y + 30, x2: x, y2: y + 80, stroke: C.acento, 'stroke-width': 4 }, hg);
      const lbl = U.el('g', {}, hg);
      const tx = new Texto(lbl, ctx, { txt: h.txt, x, y: y + 100, w: vertical ? 560 : 520, size: vertical ? 58 : 54, anchor: 'middle', vAnchor: 'top', t0: (h.t ?? i) + 0.25, t1: 9999, stagger: 0.05, font: tema.fuentes.texto });
      return { h, x, hg, halo, nodo, anio, conector, tx, t: h.t ?? i, desde: i ? (hitos[i - 1].anio | 0) : (h.anio | 0) - 30 };
    });
    const keys = [{ t: 0, x: x0 - sp * 0.4, y: y + 40, s: 0.92 }];
    H2.forEach(h => { keys.push({ t: h.t - 0.05, x: keys[keys.length - 1].x, y: y + 40, s: 1 }); keys.push({ t: h.t + 0.6, x: h.x, y: y + 40, s: 1 }); });
    keys.push({ t: b.dur + 0.6, x: keys[keys.length - 1].x + 30, y: y + 40, s: 1.04 });
    const cam = APE.camara(b.cam, ctx, keys.filter((k, i, a) => !i || k.t > a[i - 1].t));
    return {
      cajaTexto: APE.cajaTexto(ctx, vertical ? 'abajo' : 'arriba'),
      update(t) {
        cam(t);
        const ultimo = H2.reduce((a, h, i) => (t >= h.t ? i : a), -1);
        const q = ultimo < 0 ? U.p(t, 0, 0.6) * 0.1 : (ultimo + 1.2) / (H2.length + 1);
        U.trazo(eje, U.eo(U.clamp(q)));
        H2.forEach((h, i) => {
          const qa = U.p(t, h.t, h.t + 0.5);
          U.show(h.hg, qa > 0);
          if (qa <= 0) return;
          const actual = i === ultimo;
          const s = U.back(qa) * (actual ? 1.12 : 0.9);
          h.nodo.setAttribute('transform', U.sAt(h.x, y, s));
          const ph = ((t - h.t) % 1.2) / 1.2;
          h.halo.setAttribute('r', 22 + ph * (actual ? 50 : 0)); h.halo.setAttribute('opacity', actual ? 0.4 * (1 - ph) : 0);
          const n = Math.round(U.lerp(h.desde, h.h.anio | 0, U.eo(U.p(t, h.t, h.t + 0.6))));
          h.anio.textContent = isNaN(n) || !(h.h.anio | 0) ? h.h.anio : n;
          h.anio.setAttribute('fill', actual ? C.acento : C.tinta);
          h.anio.setAttribute('transform', `translate(0,${(1 - U.eo(qa)) * 40}) ` + U.sAt(h.x, y - 60, actual ? 1 : 0.8));
          h.anio.setAttribute('opacity', U.eo(qa) * (actual ? 1 : 0.55));
          h.conector.setAttribute('opacity', U.p(t, h.t + 0.2, h.t + 0.4));
          h.tx.update(t);
          h.tx.g.setAttribute('opacity', actual ? 1 : (vertical ? 0.3 : 0.5));
        });
      },
    };
  };

  // ---------- cifra que cuenta ----------
  APE.escenas.cifra = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const g = U.el('g', {}, b.cam);
    const cx = W / 2, cy = vertical ? H * 0.4 : H * 0.42;
    const rayos = U.el('g', {}, g);
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; U.el('path', { d: `M${cx} ${cy} L${cx + Math.cos(a) * 1600} ${cy + Math.sin(a) * 1600} L${cx + Math.cos(a + 0.07) * 1600} ${cy + Math.sin(a + 0.07) * 1600} Z`, fill: C.tinta, opacity: 0.045 }, rayos); }
    const anillos = [0, 1, 2].map(() => U.el('circle', { cx, cy, r: 10, fill: 'none', stroke: C.acento, 'stroke-width': 6 }, g));
    const fs = d.tam || (vertical ? 330 : 360);
    const num = U.el('text', { x: cx, y: cy + fs * 0.35, 'text-anchor': 'middle', 'font-family': tema.fuentes.cifra || tema.fuentes.titulo, 'font-weight': 700, 'font-size': fs, fill: C.acento }, g);
    if (tema.contorno) { num.setAttribute('stroke', tema.contorno); num.setAttribute('stroke-width', 10); num.setAttribute('paint-order', 'stroke'); }
    { const fmt0 = v => (d.prefijo || '') + (d.miles ? Math.round(v).toLocaleString('es-DO') : Math.round(v)) + (d.sufijo || '');
      num.textContent = fmt0(Math.max(Math.abs(d.desde ?? 0), Math.abs(d.hasta ?? 0)));
      try { const w = num.getComputedTextLength(), lim = W * 0.84 / 1.2; if (w > lim) { num.setAttribute('font-size', fs * lim / w); num.setAttribute('y', cy + fs * lim / w * 0.35); } } catch (e) {} }
    const t0 = d.tConteo ?? 0.25, t1 = t0 + (d.durConteo ?? 1.8);
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: cx, y: H / 2, s: 0.9 }, { t: t1, x: cx, y: H / 2, s: 1.0 }, { t: b.dur + 0.6, x: cx, y: H / 2, s: 1.08 }]);
    const fmt = v => (d.prefijo || '') + (d.miles ? Math.round(v).toLocaleString('es-DO') : Math.round(v)) + (d.sufijo || '');
    const caja = vertical ? { x: W / 2, y: H * 0.66, w: W * 0.84, size: 84 * (tema.tamTexto || 1), anchor: 'middle', vAnchor: 'top' } : { x: W / 2, y: H * 0.72, w: W * 0.75, size: 78 * (tema.tamTexto || 1), anchor: 'middle', vAnchor: 'top' };
    return {
      cajaTexto: caja,
      update(t) {
        cam(t);
        rayos.setAttribute('transform', `rotate(${t * 6},${cx},${cy})`);
        const q = U.eoq(U.p(t, t0, t1));
        num.textContent = fmt(U.lerp(d.desde ?? 0, d.hasta ?? 0, q));
        const punch = t > t1 ? 1 + 0.12 * Math.exp(-(t - t1) * 6) * Math.cos((t - t1) * 20) : 0.85 + 0.15 * q;
        num.setAttribute('transform', U.sAt(cx, cy, punch));
        num.setAttribute('opacity', U.p(t, t0 - 0.1, t0 + 0.2));
        anillos.forEach((a, i) => { const ph = U.p(t, t1 + i * 0.18, t1 + i * 0.18 + 1.1); a.setAttribute('r', 60 + ph * (vertical ? 520 : 620)); a.setAttribute('opacity', ph > 0 ? (1 - ph) : 0); });
      },
    };
  };

  // ---------- lista de ideas con íconos ----------
  APE.escenas.lista = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const g = U.el('g', {}, b.cam);
    const items = d.items || [];
    const n = items.length, gapY = vertical ? 260 : 170, top = (vertical ? H * 0.45 : H * 0.55) - (n - 1) * gapY / 2 + (d.texto ? 30 : 0);
    const x = vertical ? 150 : W * 0.3;
    const L = items.map((it, i) => {
      const y = top + i * gapY;
      const ig = U.el('g', {}, g);
      const circ = U.el('circle', { cx: x, cy: y, r: vertical ? 74 : 64, fill: it.color || (i % 2 ? C.acento2 : C.acento) }, ig);
      const ic = APE.icono(ig, it.icono || 'check', x, y, vertical ? 82 : 70, C.sobreAcento || '#fff');
      const tx = new Texto(ig, ctx, { txt: it.txt, x: x + (vertical ? 120 : 110), y, w: vertical ? W - 330 : W * 0.55, size: vertical ? 70 : 72, anchor: 'start', vAnchor: 'middle', t0: (it.t ?? 0.3 + i * 0.8) + 0.15, t1: 9999, font: tema.fuentes.texto });
      return { it, y, ig, circ, ic, tx, t: it.t ?? 0.3 + i * 0.8 };
    });
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: W / 2, y: H / 2 + 40, s: 1.04 }, { t: b.dur + 0.6, x: W / 2, y: H / 2 - 20, s: 1.0 }]);
    return {
      cajaTexto: APE.cajaTexto(ctx, 'arriba'),
      update(t) {
        cam(t);
        L.forEach(l => {
          const q = U.p(t, l.t, l.t + 0.5);
          U.show(l.ig, q > 0);
          if (q <= 0) return;
          l.circ.setAttribute('transform', U.sAt(x, l.y, U.back(q)));
          l.ic.setAttribute('opacity', U.p(t, l.t + 0.2, l.t + 0.4));
          l.tx.update(t);
          const w = Math.sin((t - l.t) * 2.2) * 3;
          l.circ.setAttribute('transform', U.sAt(x, l.y, U.back(q) * (1 + 0.02 * Math.sin((t - l.t) * 3))) + ` rotate(${w},${x},${l.y})`);
        });
      },
    };
  };

  // ---------- comparar con barras ----------
  APE.escenas.comparar = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const g = U.el('g', {}, b.cam);
    const barras = d.barras || [];
    const max = d.max || Math.max(...barras.map(x => x.valor), 1);
    const n = barras.length;
    const area = vertical ? { x: 110, y: H * 0.3, w: W - 220, h: H * 0.38 } : { x: W * 0.12, y: H * 0.33, w: W * 0.76, h: H * 0.44 };
    const bw = Math.min(260, area.w / n * 0.6), gap = area.w / n;
    const base = area.y + area.h;
    U.el('line', { x1: area.x, y1: base, x2: area.x + area.w, y2: base, stroke: C.tinta, 'stroke-width': 4, opacity: 0.7 }, g);
    const B = barras.map((br, i) => {
      const x = area.x + gap * i + gap / 2;
      const bg = U.el('g', {}, g);
      const rect = U.el('rect', { x: x - bw / 2, width: bw, rx: tema.radioCaja ?? 14, fill: br.color || (i % 2 ? C.acento2 : C.acento) }, bg);
      const val = U.el('text', { x, 'text-anchor': 'middle', 'font-family': tema.fuentes.titulo, 'font-weight': 700, 'font-size': vertical ? 74 : 70, fill: C.tinta }, bg);
      const lab = U.el('text', { x, y: base + (vertical ? 70 : 64), 'text-anchor': 'middle', 'font-family': tema.fuentes.texto, 'font-weight': 700, 'font-size': vertical ? 46 : 44, fill: C.tinta }, bg);
      lab.textContent = br.etiqueta || '';
      if (br.icono) APE.icono(bg, br.icono, x, base + (vertical ? 140 : 130), 64, C.tinta);
      return { br, x, bg, rect, val, lab, t: br.t ?? 0.3 + i * 0.5 };
    });
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: W / 2, y: H / 2, s: 1.06 }, { t: b.dur + 0.6, x: W / 2, y: H / 2, s: 1.0 }]);
    return {
      cajaTexto: vertical ? { x: W / 2, y: H * 0.15, w: W * 0.84, size: 78 * (tema.tamTexto || 1), anchor: 'middle', vAnchor: 'middle' } : APE.cajaTexto(ctx, 'arriba'),
      update(t) {
        cam(t);
        B.forEach(x => {
          const q = U.eoq(U.p(t, x.t, x.t + 1.0));
          U.show(x.bg, t >= x.t);
          const h = Math.max(area.h * (x.br.valor / max) * q, 2);
          x.rect.setAttribute('y', base - h); x.rect.setAttribute('height', h);
          const v = x.br.valor * q;
          x.val.textContent = (x.br.prefijo || '') + (Number.isInteger(x.br.valor) ? Math.round(v).toLocaleString('es-DO') : v.toFixed(1)) + (x.br.sufijo || '');
          x.val.setAttribute('y', base - h - 24);
          x.lab.setAttribute('opacity', U.p(t, x.t, x.t + 0.3));
        });
      },
    };
  };

  // ---------- cierre: distinto en redes y en YouTube ----------
  APE.escenas.cierre = function (ctx, d, b) {
    const { W, H, vertical, tema, formato } = ctx, C = tema.colores;
    const g = U.el('g', {}, b.cam);
    const deco = tema.decorCierre ? tema.decorCierre(ctx, g, d) : null;
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: W / 2, y: H / 2, s: 1.08 }, { t: b.dur, x: W / 2, y: H / 2, s: 1.0 }]);
    const font = tema.fuentes.titulo;
    if (formato === 'redes') {
      const palabra = (d.palabra || tema.palabra || 'Historia').toLocaleUpperCase('es');
      const cy = H * 0.5;
      const sup = new Texto(g, ctx, { txt: d.antes || 'Comenta la palabra', x: W / 2, y: cy - 250, w: W * 0.85, size: 88, anchor: 'middle', vAnchor: 'middle', t0: 0.2, t1: 999, font: tema.fuentes.texto });
      const caja = U.el('g', {}, g);
      const fs = Math.min(200, (W * 0.78) / (palabra.length * 0.62));
      const rect = U.el('rect', { x: W * 0.08, y: cy - fs * 0.62, width: W * 0.84, height: fs * 1.3, rx: 28, fill: C.acento }, caja);
      const te = U.el('text', { x: W / 2, y: cy + fs * 0.33, 'text-anchor': 'middle', 'font-family': font, 'font-weight': 700, 'font-size': fs, fill: C.sobreAcento || '#fff', 'letter-spacing': 6 }, caja);
      const cursor = U.el('rect', { width: 10, height: fs * 0.9, fill: C.sobreAcento || '#fff' }, caja);
      const burbuja = U.el('g', {}, g);
      APE.icono(burbuja, 'comentario', W / 2, cy + 330, 190, C.tinta);
      const pts = [0, 1, 2].map(i => U.el('circle', { cx: W / 2 - 46 + i * 46, cy: cy + 318, r: 13, fill: C.fondo }, burbuja));
      const flecha = U.el('path', { d: `M${W / 2} ${cy + 470} l-34 -40 h22 v-50 h24 v50 h22 z`, fill: C.acento }, g);
      return {
        cajaTexto: APE.cajaTexto(ctx, 'abajo'),
        update(t) {
          cam(t); sup.update(t); if (deco) deco(t, b.dur);
          const q = U.back(U.p(t, 0.5, 1.0));
          caja.setAttribute('transform', U.sAt(W / 2, cy, Math.max(q, 0.001)) + ` rotate(${Math.sin(t * 2.4) * 1.5},${W / 2},${cy})`);
          const nch = Math.floor(U.clamp(U.p(t, 0.9, 0.9 + palabra.length * 0.09)) * palabra.length);
          te.textContent = palabra.slice(0, nch);
          const tw = te.getComputedTextLength();
          cursor.setAttribute('x', W / 2 + tw / 2 + 8); cursor.setAttribute('y', cy - fs * 0.45);
          cursor.setAttribute('opacity', Math.floor(t * 2.5) % 2 ? 0 : 1);
          const qb = U.back(U.p(t, 1.3, 1.8));
          burbuja.setAttribute('transform', U.sAt(W / 2, cy + 330, Math.max(qb, 0.001)) + ` translate(0,${Math.sin(t * 3) * 10})`);
          pts.forEach((p, i) => p.setAttribute('transform', `translate(0,${-Math.max(0, Math.sin(t * 6 - i * 0.8)) * 14})`));
          flecha.setAttribute('transform', `translate(0,${Math.abs(Math.sin(t * 3.2)) * -26})`);
          flecha.setAttribute('opacity', U.p(t, 1.8, 2.1));
        },
      };
    }
    // YouTube: suscripción + próximo episodio
    const cy = H * 0.42;
    const tit = new Texto(g, ctx, { txt: d.titulo || 'Suscríbete y activa la campanita', x: W / 2, y: H * 0.17, w: W * 0.8, size: 92, anchor: 'middle', vAnchor: 'middle', t0: 0.2, t1: 999 });
    const boton = U.el('g', {}, g);
    const bw = 560, bh = 130;
    const br = U.el('rect', { x: W / 2 - bw / 2 - 90, y: cy - bh / 2, width: bw, height: bh, rx: bh / 2, fill: '#e62117' }, boton);
    const bt = U.el('text', { x: W / 2 - 90, y: cy + 22, 'text-anchor': 'middle', 'font-family': tema.fuentes.texto, 'font-weight': 700, 'font-size': 62, fill: '#fff', 'letter-spacing': 2 }, boton);
    bt.textContent = 'SUSCRIBIRME';
    const camp = U.el('g', {}, boton);
    U.el('circle', { cx: W / 2 + bw / 2 - 10, cy, r: 62, fill: C.tinta }, camp);
    APE.icono(camp, 'campana', W / 2 + bw / 2 - 10, cy, 72, C.fondo);
    const mano = U.el('path', { d: 'M0 0 L0 78 L20 60 L34 92 L48 86 L34 54 L60 54 Z', fill: '#ffffff', stroke: '#111111', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    const prox = U.el('g', {}, g);
    const pw = 1100, ph = 230, py = H * 0.68;
    U.el('rect', { x: W / 2 - pw / 2, y: py, width: pw, height: ph, rx: 22, fill: U.claro(C.fondo, 0.08), stroke: C.acento, 'stroke-width': 5 }, prox);
    U.el('rect', { x: W / 2 - pw / 2 + 24, y: py + 24, width: 300, height: ph - 48, rx: 14, fill: C.acento }, prox);
    APE.icono(prox, 'play', W / 2 - pw / 2 + 174, py + ph / 2, 110, C.sobreAcento || '#fff');
    const l1 = U.el('text', { x: W / 2 - pw / 2 + 360, y: py + 80, 'font-family': tema.fuentes.texto, 'font-weight': 700, 'font-size': 38, fill: C.acento, 'letter-spacing': 3 }, prox);
    l1.textContent = (d.etiquetaProximo || 'PRÓXIMO EPISODIO');
    const l2 = new Texto(prox, ctx, { txt: d.proximo || 'Lo que pasó después', x: W / 2 - pw / 2 + 360, y: py + 100, w: pw - 400, size: 60, anchor: 'start', vAnchor: 'top', t0: 1.4, t1: 999, upper: false, font: tema.fuentes.texto });
    return {
      cajaTexto: APE.cajaTexto(ctx, 'abajo'),
      update(t) {
        cam(t); tit.update(t); if (deco) deco(t, b.dur);
        const q = U.back(U.p(t, 0.4, 0.9));
        boton.setAttribute('transform', U.sAt(W / 2, cy, Math.max(q, 0.001)));
        const click = U.p(t, 1.6, 1.75);
        const press = click > 0 && click < 1 ? 0.93 : 1;
        if (t > 1.7) { br.setAttribute('fill', '#606060'); bt.textContent = 'SUSCRITO ✓'; } else { br.setAttribute('fill', '#e62117'); bt.textContent = 'SUSCRIBIRME'; }
        boton.setAttribute('transform', U.sAt(W / 2, cy, Math.max(q, 0.001) * press));
        camp.setAttribute('transform', t > 2.0 ? `rotate(${Math.sin(t * 22) * 16 * Math.exp(-(t - 2) * 1.5)},${W / 2 + bw / 2 - 10},${cy - 40})` : '');
        const mq = U.eio(U.p(t, 0.9, 1.6));
        const mx = U.lerp(W * 0.8, W / 2 - 60, mq), my = U.lerp(H * 0.9, cy + 30, mq);
        mano.setAttribute('transform', `translate(${mx},${my + (press < 1 ? 8 : 0)})`);
        mano.setAttribute('opacity', U.p(t, 0.9, 1.1) * (1 - U.p(t, 2.2, 2.5)));
        const qp = U.eo(U.p(t, 1.1, 1.6));
        prox.setAttribute('transform', `translate(0,${(1 - qp) * 300})`); prox.setAttribute('opacity', qp);
        l2.update(t);
      },
    };
  };

  // ---------- aviso de mitad: compartir y seguir ----------
  APE.superpuestos.compartir = function (ctx, d, g) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const y = vertical ? H - 600 : H - 200;
    const w = vertical ? W - 100 : 1240, h = vertical ? 200 : 140;
    const x = W / 2 - w / 2;
    const card = U.el('g', { filter: 'url(#ape-sombra)' }, g);
    U.el('rect', { x, y, width: w, height: h, rx: h / 2, fill: C.tarjeta || U.claro(C.fondo, 0.1), stroke: C.acento, 'stroke-width': 4 }, card);
    const ic1 = U.el('g', {}, card), ic2 = U.el('g', {}, card);
    const icR = h * 0.36;
    U.el('circle', { cx: x + h / 2, cy: y + h / 2, r: icR, fill: C.acento }, ic1);
    APE.icono(ic1, 'compartir', x + h / 2, y + h / 2, icR * 1.2, C.sobreAcento || '#fff');
    const fs = vertical ? 46 : 46;
    const t1 = U.el('text', { x: x + h + 10, y: y + h / 2 - (vertical ? 8 : 4), 'font-family': tema.fuentes.texto, 'font-weight': 700, 'font-size': fs, fill: C.tinta }, card);
    t1.textContent = vertical ? 'Si te está gustando,' : 'Si te está gustando, compártelo';
    const t2 = U.el('text', { x: x + h + 10, y: y + h / 2 + fs * (vertical ? 0.95 : 0.95), 'font-family': tema.fuentes.texto, 'font-weight': 400, 'font-size': fs * 0.82, fill: C.tinta, opacity: 0.85 }, card);
    t2.textContent = vertical ? 'compártelo y síguenos' : 'y síguenos para llegar a más personas';
    const bx = x + w - (vertical ? 210 : 250), bw2 = vertical ? 180 : 210;
    const pill = U.el('g', {}, card);
    const pr = U.el('rect', { x: bx, y: y + h / 2 - 42, width: bw2, height: 84, rx: 42, fill: C.acento }, pill);
    const pt = U.el('text', { x: bx + bw2 / 2, y: y + h / 2 + 14, 'text-anchor': 'middle', 'font-family': tema.fuentes.texto, 'font-weight': 700, 'font-size': 38, fill: C.sobreAcento || '#fff' }, pill);
    pt.textContent = 'SEGUIR';
    return (t, dur) => {
      const qi = U.eoq(U.p(t, 0, 0.5)), qo = U.eio(U.p(t, dur, dur + 0.45));
      card.setAttribute('transform', `translate(0,${(1 - qi) * 300 + qo * 300})`);
      card.setAttribute('opacity', Math.min(qi * 2, 1) * (1 - qo));
      ic1.setAttribute('transform', `rotate(${Math.sin(t * 5) * 10},${x + h / 2},${y + h / 2})`);
      const pulse = 1 + 0.06 * Math.max(0, Math.sin(t * 6));
      pill.setAttribute('transform', U.sAt(bx + bw2 / 2, y + h / 2, pulse));
      if (t > dur * 0.6) { pr.setAttribute('fill', U.claro(C.fondo, 0.25)); pt.textContent = 'SIGUIENDO'; pt.setAttribute('font-size', 32); } else { pr.setAttribute('fill', C.acento); pt.textContent = 'SEGUIR'; pt.setAttribute('font-size', 38); }
    };
  };
})();
