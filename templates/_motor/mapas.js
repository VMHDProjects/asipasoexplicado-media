/* Mapas que se trazan. Coordenadas aproximadas (lon, lat), dibujo estilizado. */
(function () {
  const { U } = APE;

  APE.regiones = {
    hispaniola: {
      bbox: [-74.6, 17.5, -68.2, 20.1],
      tierras: [
        [[-73.40, 19.84], [-73.15, 19.93], [-72.83, 19.95], [-72.55, 19.88], [-72.20, 19.77], [-71.84, 19.70], [-71.65, 19.88], [-71.40, 19.89], [-71.10, 19.90], [-70.90, 19.85], [-70.69, 19.80], [-70.52, 19.76], [-70.25, 19.68], [-69.95, 19.67], [-69.88, 19.50], [-69.85, 19.38], [-69.72, 19.30], [-69.55, 19.33], [-69.30, 19.34], [-69.13, 19.30], [-69.25, 19.18], [-69.45, 19.20], [-69.62, 19.22], [-69.75, 19.15], [-69.55, 19.07], [-69.38, 19.06], [-69.15, 19.00], [-68.95, 18.95], [-68.70, 18.90], [-68.45, 18.75], [-68.32, 18.61], [-68.37, 18.48], [-68.45, 18.38], [-68.65, 18.30], [-68.85, 18.36], [-68.97, 18.42], [-69.30, 18.44], [-69.60, 18.44], [-69.90, 18.46], [-70.05, 18.40], [-70.20, 18.23], [-70.35, 18.25], [-70.52, 18.20], [-70.62, 18.30], [-70.75, 18.27], [-71.05, 18.25], [-71.10, 18.10], [-71.25, 17.88], [-71.42, 17.62], [-71.55, 17.80], [-71.70, 18.00], [-71.90, 18.10], [-72.20, 18.18], [-72.55, 18.20], [-72.90, 18.15], [-73.30, 18.25], [-73.60, 18.20], [-73.85, 18.05], [-74.10, 18.20], [-74.45, 18.35], [-74.45, 18.60], [-74.20, 18.66], [-73.90, 18.57], [-73.50, 18.50], [-73.10, 18.45], [-72.80, 18.43], [-72.55, 18.52], [-72.35, 18.58], [-72.40, 18.75], [-72.65, 18.95], [-72.75, 19.15], [-72.70, 19.45], [-72.95, 19.62], [-73.25, 19.68]],
        [[-73.30, 18.93], [-72.95, 18.98], [-72.70, 18.80], [-73.05, 18.75]],
        [[-68.90, 18.20], [-68.60, 18.20], [-68.55, 18.12], [-68.85, 18.10]],
      ],
      frontera: [[-71.73, 19.71], [-71.70, 19.55], [-71.65, 19.35], [-71.75, 19.20], [-71.65, 19.05], [-71.75, 18.90], [-71.90, 18.70], [-72.00, 18.60], [-71.85, 18.48], [-71.80, 18.30], [-71.74, 18.05]],
      etiquetas: [{ txt: 'Haití', lon: -72.75, lat: 18.95 }, { txt: 'República Dominicana', lon: -70.35, lat: 18.82 }],
      mar: [{ txt: 'Océano Atlántico', lon: -71.0, lat: 20.0 }, { txt: 'Mar Caribe', lon: -70.4, lat: 17.75 }],
      ciudades: {
        'Santo Domingo': [-69.93, 18.48], 'Santiago': [-70.70, 19.45], 'Puerto Plata': [-70.69, 19.79], 'Moca': [-70.52, 19.39],
        'La Vega': [-70.53, 19.22], 'San Francisco de Macorís': [-70.25, 19.30], 'San Pedro de Macorís': [-69.30, 18.46], 'La Romana': [-68.97, 18.43],
        'Samaná': [-69.34, 19.21], 'Monte Cristi': [-71.65, 19.85], 'Dajabón': [-71.71, 19.55], 'Barahona': [-71.10, 18.21],
        'Azua': [-70.73, 18.45], 'Baní': [-70.33, 18.28], 'Higüey': [-68.71, 18.62], 'San Juan': [-71.23, 18.81],
        'San Cristóbal': [-70.11, 18.42], 'Bonao': [-70.41, 18.94], 'Cotuí': [-70.15, 19.05], 'Jarabacoa': [-70.64, 19.12],
        'El Seibo': [-69.04, 18.76], 'Hato Mayor': [-69.26, 18.76], 'Nagua': [-69.85, 19.38], 'Neiba': [-71.42, 18.48],
        'Puerto Príncipe': [-72.34, 18.54], 'Cabo Haitiano': [-72.20, 19.76], 'La Isabela': [-71.08, 19.89], 'Pedernales': [-71.74, 18.04],
      },
    },
    levante: {
      bbox: [29.2, 27.4, 37.4, 34.6],
      fondoTierra: true,
      mares: [
        [[29.2, 31.05], [29.9, 31.2], [30.4, 31.45], [31.0, 31.6], [31.6, 31.5], [32.3, 31.25], [32.9, 31.15], [33.6, 31.12], [34.2, 31.32], [34.45, 31.55], [34.75, 32.05], [34.9, 32.5], [34.98, 32.82], [35.1, 33.1], [35.2, 33.27], [35.37, 33.56], [35.5, 33.9], [35.65, 34.3], [35.85, 34.6], [29.2, 34.6]],
        [[32.55, 29.95], [32.4, 29.6], [32.8, 28.9], [33.3, 28.2], [33.9, 27.4], [35.0, 27.4], [34.6, 28.2], [34.85, 28.9], [35.0, 29.55], [34.8, 29.0], [34.4, 28.0], [34.25, 27.75], [33.75, 28.2], [33.2, 28.9], [32.7, 29.6]],
      ],
      lagos: [[[35.45, 31.15], [35.6, 31.15], [35.6, 31.75], [35.45, 31.75]], [[35.53, 32.7], [35.66, 32.72], [35.64, 32.9], [35.52, 32.88]]],
      rios: [[[35.58, 32.7], [35.55, 32.4], [35.58, 32.1], [35.53, 31.78]], [[31.2, 27.4], [31.0, 28.3], [30.9, 29.2], [31.25, 30.05], [31.0, 30.6], [30.5, 31.2]], [[31.25, 30.05], [31.6, 30.6], [31.8, 31.4]]],
      etiquetas: [{ txt: 'Canaán', lon: 35.0, lat: 31.95 }, { txt: 'Egipto', lon: 30.2, lat: 28.6 }, { txt: 'Sinaí', lon: 33.9, lat: 29.4 }],
      mar: [{ txt: 'Mar Grande', lon: 31.6, lat: 33.4 }, { txt: 'Mar Rojo', lon: 34.2, lat: 27.6 }],
      ciudades: {
        'Jerusalén': [35.23, 31.78], 'Salem': [35.23, 31.78], 'Belén': [35.2, 31.7], 'Nazaret': [35.3, 32.7], 'Jericó': [35.44, 31.87],
        'Hebrón': [35.1, 31.53], 'Betel': [35.22, 31.93], 'Siquem': [35.28, 32.21], 'Beerseba': [34.79, 31.25], 'Gaza': [34.45, 31.5],
        'Sodoma': [35.4, 31.0], 'Menfis': [31.25, 29.85], 'Monte Sinaí': [33.97, 28.54], 'Damasco': [36.3, 33.5], 'Tiro': [35.2, 33.27],
        'Capernaum': [35.57, 32.88], 'Mar de Galilea': [35.59, 32.8], 'Río Jordán': [35.56, 32.2],
      },
    },
  };

  APE.escenas.mapa = function (ctx, d, b) {
    const { W, H, vertical, tema } = ctx, C = tema.colores;
    const R = APE.regiones[d.region || 'hispaniola'];
    const [x0, y0, x1, y1] = d.bbox || R.bbox;
    const box = vertical ? { x: 50, y: 300, w: W - 100, h: H * 0.42 } : { x: 120, y: 70, w: W - 240, h: H * 0.68 };
    const cl = Math.cos(((y0 + y1) / 2) * Math.PI / 180);
    const sx = box.w / ((x1 - x0) * cl), sy = box.h / (y1 - y0), s = Math.min(sx, sy);
    const ox = box.x + (box.w - (x1 - x0) * cl * s) / 2, oy = box.y + (box.h - (y1 - y0) * s) / 2;
    const P = ([lon, lat]) => [ox + (lon - x0) * cl * s, oy + (y1 - lat) * s];
    const lugar = n => (Array.isArray(n) ? P(n) : P(R.ciudades[n] || [0, 0]));
    const poly = (pts, close = true) => pts.map((q, i) => (i ? 'L' : 'M') + P(q).map(v => v.toFixed(1)).join(' ')).join('') + (close ? 'Z' : '');
    const g = U.el('g', {}, b.cam);
    const fondoTierra = R.fondoTierra;
    U.el('rect', { x: -W, y: -H, width: W * 3, height: H * 3, fill: fondoTierra ? C.tierra : C.mar }, g);
    // retícula
    const ret = U.el('g', { opacity: 0.35 }, g);
    const lineas = [];
    for (let lo = Math.ceil(x0 - 2); lo <= x1 + 2; lo += 0.5) { const [a] = P([lo, 0]); lineas.push(U.el('line', { x1: a, y1: -H, x2: a, y2: H * 2, stroke: C.reticula || C.tinta, 'stroke-width': 1.4, pathLength: 1 }, ret)); }
    for (let la = Math.ceil(y0 - 2); la <= y1 + 2; la += 0.5) { const [, a] = P([0, la]); lineas.push(U.el('line', { x1: -W, y1: a, x2: W * 2, y2: a, stroke: C.reticula || C.tinta, 'stroke-width': 1.4, pathLength: 1 }, ret)); }
    // tierras o mares
    const formas = [];
    (fondoTierra ? R.mares : R.tierras).forEach((pts, k) => {
      const dd = poly(pts, !fondoTierra || k > 0);
      const relleno = U.el('path', { d: dd, fill: fondoTierra ? C.mar : C.tierra, opacity: 0 }, g);
      const costa = U.el('path', { d: dd, fill: 'none', stroke: C.costa || C.tinta, 'stroke-width': 4.5, 'stroke-linejoin': 'round', pathLength: 1 }, g);
      formas.push({ relleno, costa, k });
    });
    (R.lagos || []).forEach(pts => formas.push({ relleno: U.el('path', { d: poly(pts), fill: C.mar, opacity: 0 }, g), costa: U.el('path', { d: poly(pts), fill: 'none', stroke: C.costa || C.tinta, 'stroke-width': 3, pathLength: 1 }, g), k: 9 }));
    const rios = (R.rios || []).map(pts => U.el('path', { d: poly(pts, false), fill: 'none', stroke: C.mar, 'stroke-width': 4, pathLength: 1 }, g));
    const fr = R.frontera && d.frontera !== false ? U.el('path', { d: poly(R.frontera, false), fill: 'none', stroke: C.frontera || C.acento, 'stroke-width': 4, 'stroke-dasharray': '1 1', pathLength: 1 }, g) : null;
    const pluma = U.el('circle', { r: 9, fill: C.acento2 || C.acento }, g);
    const plumaHalo = U.el('circle', { r: 22, fill: C.acento2 || C.acento, opacity: 0.35 }, g);
    const font = tema.fuentes.texto;
    const etiquetas = (d.etiquetas !== false ? (R.etiquetas || []) : []).map(e => {
      const [x, y] = P([e.lon, e.lat]);
      const te = U.el('text', { x, y, 'text-anchor': 'middle', 'font-family': font, 'font-size': vertical ? 30 : 34, 'font-weight': 700, fill: C.etiqueta || C.tinta, opacity: 0, 'letter-spacing': 6 }, g);
      te.textContent = e.txt.toLocaleUpperCase('es'); return te;
    });
    const mares = (R.mar || []).map(e => {
      const [x, y] = P([e.lon, e.lat]);
      const te = U.el('text', { x, y, 'text-anchor': 'middle', 'font-family': tema.fuentes.serif || font, 'font-size': vertical ? 28 : 32, 'font-style': 'italic', fill: C.tinta, opacity: 0 }, g);
      te.textContent = e.txt; return te;
    });
    // rosa de los vientos
    const rosa = U.el('g', {}, g);
    const [rx, ry] = vertical ? [box.x + box.w - 90, box.y + 40] : [box.x + box.w - 70, box.y + box.h - 90];
    const rg = U.el('g', {}, rosa);
    U.el('circle', { cx: 0, cy: 0, r: 54, fill: 'none', stroke: C.tinta, 'stroke-width': 2, opacity: 0.6 }, rg);
    U.el('path', { d: 'M0 -70 L12 0 L0 70 L-12 0 Z', fill: C.tinta, opacity: 0.8 }, rg);
    U.el('path', { d: 'M-70 0 L0 10 L70 0 L0 -10 Z', fill: C.tinta, opacity: 0.45 }, rg);
    U.el('path', { d: 'M0 -70 L12 0 L-12 0 Z', fill: C.acento }, rg);
    // ruta y puntos
    const rutas = (d.rutas || (d.ruta ? [d.ruta] : [])).map(r => {
      const [ax, ay] = lugar(r.de), [bx, by] = lugar(r.a);
      const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * 0.35;
      const p = U.el('path', { d: `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`, fill: 'none', stroke: C.ruta || C.acento2 || C.acento, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, g);
      const dot = U.el('circle', { r: 11, fill: C.tinta, stroke: C.ruta || C.acento, 'stroke-width': 4 }, g);
      return { r, p, dot, t: r.t ?? 1.5, dur: r.dur ?? 1.4 };
    });
    const pins = (d.puntos || []).map((pt, k) => {
      const [x, y] = lugar(pt.lugar || pt.nombre);
      const pg = U.el('g', {}, g);
      const ring = U.el('circle', { cx: x, cy: y, r: 10, fill: 'none', stroke: C.acento, 'stroke-width': 4 }, pg);
      const ring2 = U.el('circle', { cx: x, cy: y, r: 10, fill: 'none', stroke: C.acento, 'stroke-width': 3 }, pg);
      const pin = U.el('g', {}, pg);
      U.el('path', { d: `M${x} ${y} C ${x - 6} ${y - 18} ${x - 22} ${y - 26} ${x - 22} ${y - 44} A22 22 0 1 1 ${x + 22} ${y - 44} C ${x + 22} ${y - 26} ${x + 6} ${y - 18} ${x} ${y} Z`, fill: C.acento, stroke: C.contornoPin || '#000', 'stroke-width': 2.5 }, pin);
      U.el('circle', { cx: x, cy: y - 44, r: 8, fill: C.tinta }, pin);
      const lado = pt.lado || (x > box.x + box.w * 0.7 ? -1 : 1);
      const lab = U.el('g', {}, pg);
      const fs = vertical ? 34 : 38;
      const te = U.el('text', { x: x + lado * 34, y: y - 30, 'text-anchor': lado > 0 ? 'start' : 'end', 'font-family': font, 'font-size': fs, 'font-weight': 700, fill: C.etiquetaPin || C.tinta, stroke: C.contornoTexto || C.mar, 'stroke-width': 8, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, lab);
      te.textContent = pt.etiqueta || pt.nombre || pt.lugar;
      return { pt, x, y, pin, ring, ring2, lab, t: pt.t ?? 1 + k };
    });
    // cámara
    const cx0 = box.x + box.w / 2, cy0 = box.y + box.h / 2;
    const keys = [{ t: 0, x: cx0, y: cy0, s: 0.94 }, { t: 1.8, x: cx0, y: cy0, s: 1.0 }];
    const enfoques = (d.enfoques || (d.enfoque ? [d.enfoque] : []));
    enfoques.forEach(e => { const [x, y] = lugar(e.lugar); const pv = keys[keys.length - 1]; keys.push({ t: Math.max(e.t, pv.t + 0.01), x: pv.x, y: pv.y, s: pv.s }); keys.push({ t: e.t + (e.dur || 1.2), x, y: y - 30, s: e.escala || 2.2 }); });
    keys.push({ t: b.dur + 1, x: keys[keys.length - 1].x, y: keys[keys.length - 1].y, s: keys[keys.length - 1].s * 1.05 });
    const cam = APE.camara(b.cam, ctx, keys);
    const tTraza = d.tTrazo ?? 1.7;

    return {
      cajaTexto: vertical ? { x: W / 2, y: H * 0.74, w: W * 0.84, size: 84 * (tema.tamTexto || 1), anchor: 'middle', vAnchor: 'middle' } : { x: W / 2, y: H * 0.88, w: W * 0.82, size: 74 * (tema.tamTexto || 1), anchor: 'middle', vAnchor: 'middle' },
      update(t) {
        cam(t);
        lineas.forEach((l, k) => U.trazo(l, U.eo(U.p(t, k * 0.012, 0.6 + k * 0.012))));
        let tip = null;
        formas.forEach(f => {
          const a = f.k === 0 ? 0.1 : 0.6 + f.k * 0.15, z = f.k === 0 ? tTraza : a + 0.7;
          const q = U.eio(U.p(t, a, z));
          U.trazo(f.costa, q);
          f.relleno.setAttribute('opacity', U.p(t, z - 0.3, z + 0.4));
          if (f.k === 0 && q > 0 && q < 1) { const L = f.costa.getTotalLength(); tip = f.costa.getPointAtLength(L * q); }
        });
        rios.forEach((r, k) => U.trazo(r, U.eo(U.p(t, tTraza - 0.2 + k * 0.2, tTraza + 0.8 + k * 0.2))));
        U.show(pluma, !!tip); U.show(plumaHalo, !!tip);
        if (tip) { pluma.setAttribute('cx', tip.x); pluma.setAttribute('cy', tip.y); plumaHalo.setAttribute('cx', tip.x); plumaHalo.setAttribute('cy', tip.y); plumaHalo.setAttribute('r', 20 + Math.sin(t * 20) * 4); }
        if (fr) { const q = U.eio(U.p(t, tTraza, tTraza + 0.9)); fr.setAttribute('stroke-dasharray', `${q} 1`); }
        etiquetas.forEach((e, k) => { const q = U.eo(U.p(t, tTraza + 0.3 + k * 0.25, tTraza + 1 + k * 0.25)); e.setAttribute('opacity', q * 0.9); e.setAttribute('letter-spacing', 6 + (1 - q) * 18); });
        mares.forEach((e, k) => e.setAttribute('opacity', 0.55 * U.eo(U.p(t, 0.8 + k * 0.3, 1.6 + k * 0.3))));
        rosa.setAttribute('transform', `translate(${rx},${ry}) scale(${U.back(U.p(t, 0.5, 1.1))})`);
        rg.setAttribute('transform', `rotate(${U.wob(t, 0.6, 2) * 8 + (1 - U.eo(U.p(t, 0.5, 1.6))) * 180})`);
        rutas.forEach(r => {
          const q = U.eio(U.p(t, r.t, r.t + r.dur));
          r.p.setAttribute('stroke-dasharray', `${q} 1`);
          r.p.setAttribute('stroke-dashoffset', 0);
          U.show(r.dot, q > 0);
          if (q > 0) { const pt = r.p.getPointAtLength(r.p.getTotalLength() * q); r.dot.setAttribute('cx', pt.x); r.dot.setAttribute('cy', pt.y); }
        });
        pins.forEach(p => {
          const q = U.p(t, p.t, p.t + 0.55);
          U.show(p.pin.parentNode, q > 0);
          if (q <= 0) return;
          const drop = (1 - U.back(q)) * -120;
          p.pin.setAttribute('transform', `translate(0,${drop}) ` + U.sAt(p.x, p.y, 1, 0.85 + 0.15 * U.back(q)));
          const lt = t - p.t;
          [p.ring, p.ring2].forEach((r, k) => { const ph = ((lt + k * 0.7) % 1.4) / 1.4; r.setAttribute('r', 10 + ph * 60); r.setAttribute('opacity', (1 - ph) * U.p(t, p.t + 0.3, p.t + 0.5)); });
          const ql = U.eo(U.p(t, p.t + 0.3, p.t + 0.75));
          p.lab.setAttribute('opacity', ql);
          p.lab.setAttribute('transform', `translate(${(1 - ql) * -20},0)`);
        });
      },
    };
  };
})();
