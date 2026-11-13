/* Plantilla: Nutrición — 10:00 p. m. · palabra "Nutrición"
   Estilo propio: cocina de noche. Verde bosque profundo, naranja mandarina, crema y verde hoja.
   Alimentos ilustrados que caen y rebotan, plato que se arma, barras de nutrientes,
   transición de persianas. */
(function () {
  const { U, Texto } = APE;
  const T = APE.temas.nutricion = {
    nombre: 'Nutrición',
    palabra: 'Nutrición',
    colores: {
      fondo: '#12261B', tinta: '#FFF6E5', acento: '#FF9F1C', acento2: '#7BC950', sobreAcento: '#12261B', dorado: '#FFD166',
      tarjeta: '#1B3626', fondoRetrato: '#1B3626', rayasRetrato: '#7BC950', mar: '#0E1F16', tierra: '#244A33', costa: '#7BC950',
    },
    fuentes: { titulo: 'InterDisplay', texto: 'InterDisplay', serif: 'InterDisplay', cifra: 'InterDisplay' },
    pesoTitulo: 900, mayusculas: true, marcador: 'subrayado', contorno: '#12261B', interlinea: 1.04, tamTexto: 0.95, espaciado: -1,
    transicion: 'persiana', duracionTransicion: 0.6, marcoRetrato: 'tarjeta',
    grano: 0.06, vineta: 0.5,
    escenario: {
      cielo: ['#F7C873', '#FCE9C2'], sol: '#FFF4D6', lejos: '#9CC48B', medio: '#7BAF6A', tierra: '#5E8C4A',
      casas: ['#F2B5A0', '#FFE3A3', '#C8E6A0'], tinta: '#12261B', silueta: '#12261B', hojas: '#3E7A3A', tronco: '#7A5532',
    },
    fondo(ctx, g) {
      const { W, H } = ctx;
      const gid = U.uid('nf'); const rg = U.el('radialGradient', { id: gid, cx: '30%', cy: '30%', r: '90%' }, ctx.defs);
      U.el('stop', { offset: 0, 'stop-color': '#1E3A29' }, rg); U.el('stop', { offset: 1, 'stop-color': '#0A1710' }, rg);
      U.el('rect', { width: W, height: H, fill: `url(#${gid})` }, g);
      const pid = U.uid('np'); const pat = U.el('pattern', { id: pid, width: 140, height: 140, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-20)' }, ctx.defs);
      U.el('path', { d: 'M30 40 q14 -22 30 0 q-16 18 -30 0 Z', fill: '#7BC950' }, pat);
      U.el('circle', { cx: 100, cy: 100, r: 9, fill: '#FF9F1C' }, pat);
      U.el('path', { d: 'M96 30 l10 10 M106 30 l-10 10', stroke: '#FFF6E5', 'stroke-width': 3 }, pat);
      const motivo = U.el('rect', { x: -280, y: -280, width: W + 560, height: H + 560, fill: `url(#${pid})`, opacity: 0.07 }, g);
      const halo = U.el('circle', { r: W * 0.35, fill: '#FF9F1C', opacity: 0.1, filter: 'url(#ape-blur30)' }, g);
      return t => {
        motivo.setAttribute('transform', `translate(${(t * 18) % 140},${(t * -10) % 140})`);
        halo.setAttribute('cx', W * (0.75 + 0.1 * Math.sin(t * 0.2))); halo.setAttribute('cy', H * (0.7 + 0.1 * Math.cos(t * 0.25)));
      };
    },
  };

  // ilustraciones de alimentos (caja 200×200, centro 100,100)
  const ink = '#12261B';
  const A = {
    manzana: g => { U.el('path', { d: 'M100 60 C 60 40 30 80 40 120 C 50 160 80 175 100 165 C 120 175 150 160 160 120 C 170 80 140 40 100 60 Z', fill: '#E63946', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M100 62 C 100 45 104 35 110 28', stroke: ink, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g); U.el('path', { d: 'M108 42 C 125 25 145 30 148 36 C 135 50 118 50 108 42 Z', fill: '#7BC950', stroke: ink, 'stroke-width': 4 }, g); U.el('ellipse', { cx: 70, cy: 95, rx: 10, ry: 18, fill: '#fff', opacity: 0.45 }, g); },
    aguacate: g => { U.el('path', { d: 'M100 25 C 70 25 62 70 50 100 C 35 140 60 178 100 178 C 140 178 165 140 150 100 C 138 70 130 25 100 25 Z', fill: '#4E7A2C', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M100 42 C 80 42 75 80 66 104 C 56 134 74 162 100 162 C 126 162 144 134 134 104 C 125 80 120 42 100 42 Z', fill: '#D8E87A' }, g); U.el('circle', { cx: 100, cy: 122, r: 26, fill: '#8A5A2B', stroke: ink, 'stroke-width': 4 }, g); },
    huevo: g => { U.el('ellipse', { cx: 100, cy: 105, rx: 70, ry: 58, fill: '#FFFFFF', stroke: ink, 'stroke-width': 5 }, g); U.el('circle', { cx: 100, cy: 100, r: 28, fill: '#FFB703', stroke: ink, 'stroke-width': 4 }, g); U.el('circle', { cx: 90, cy: 92, r: 7, fill: '#fff', opacity: 0.7 }, g); },
    platano: g => { U.el('path', { d: 'M40 70 C 50 140 120 175 170 140 C 175 132 168 128 160 132 C 120 152 72 128 58 70 Z', fill: '#FFD23F', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('path', { d: 'M38 72 L 34 56 L 46 54 L 58 70', fill: '#6B4A2F', stroke: ink, 'stroke-width': 4 }, g); },
    brocoli: g => { U.el('path', { d: 'M88 110 L 80 175 L 120 175 L 112 110 Z', fill: '#9BD16B', stroke: ink, 'stroke-width': 5 }, g); [[70, 95, 32], [100, 70, 36], [132, 95, 32], [100, 108, 28]].forEach(([x, y, r]) => U.el('circle', { cx: x, cy: y, r, fill: '#3E8E41', stroke: ink, 'stroke-width': 5 }, g)); },
    zanahoria: g => { U.el('path', { d: 'M60 60 L 150 150 C 140 165 125 165 115 160 L 50 80 C 46 70 52 62 60 60 Z', fill: '#FB8500', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('path', { d: 'M58 62 C 40 40 30 30 26 20 M58 62 C 50 36 50 24 54 14 M58 62 C 66 40 76 32 86 28', stroke: '#3E8E41', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, g); },
    agua: g => { U.el('path', { d: 'M65 40 H 135 L 128 175 H 72 Z', fill: '#BDE0FE', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('path', { d: 'M70 90 H 130 L 128 175 H 72 Z', fill: '#4CC9F0' }, g); U.el('path', { d: 'M65 40 H 135 L 128 175 H 72 Z', fill: 'none', stroke: ink, 'stroke-width': 5 }, g); },
    azucar: g => { [[60, 90], [100, 70], [140, 90], [80, 130], [120, 130]].forEach(([x, y]) => { U.el('path', { d: `M${x - 22} ${y - 10} L${x} ${y - 22} L${x + 22} ${y - 10} L${x + 22} ${y + 14} L${x} ${y + 26} L${x - 22} ${y + 14} Z`, fill: '#FFFFFF', stroke: ink, 'stroke-width': 4 }, g); U.el('path', { d: `M${x - 22} ${y - 10} L${x} ${y + 2} L${x + 22} ${y - 10} M${x} ${y + 2} V${y + 26}`, stroke: ink, 'stroke-width': 3, fill: 'none' }, g); }); },
    pan: g => { U.el('path', { d: 'M40 120 C 40 60 160 60 160 120 L 160 160 L 40 160 Z', fill: '#E9A65A', stroke: ink, 'stroke-width': 5 }, g); [70, 100, 130].forEach(x => U.el('path', { d: `M${x - 10} 90 l20 20`, stroke: ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g)); },
    leche: g => { U.el('path', { d: 'M65 70 L 80 40 H 120 L 135 70 V 175 H 65 Z', fill: '#FFFFFF', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('rect', { x: 65, y: 100, width: 70, height: 40, fill: '#4CC9F0' }, g); U.el('path', { d: 'M65 70 L 80 40 H 120 L 135 70 V 175 H 65 Z M65 70 H 135', fill: 'none', stroke: ink, 'stroke-width': 5 }, g); },
    pescado: g => { U.el('path', { d: 'M30 100 C 60 50 130 50 150 100 C 130 150 60 150 30 100 Z', fill: '#8ECAE6', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M150 100 L 180 70 L 180 130 Z', fill: '#219EBC', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('circle', { cx: 62, cy: 92, r: 7, fill: ink }, g); },
    pollo: g => { U.el('path', { d: 'M70 60 C 120 30 175 70 160 115 C 150 150 105 150 90 135 L 60 160 C 50 170 35 160 42 148 C 30 145 28 128 40 126 L 70 105 C 55 90 55 70 70 60 Z', fill: '#C7792E', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); },
    arroz: g => { U.el('path', { d: 'M30 110 H 170 C 165 160 135 180 100 180 C 65 180 35 160 30 110 Z', fill: '#F4A261', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M38 110 C 40 60 160 60 162 110 Z', fill: '#FFFFFF', stroke: ink, 'stroke-width': 5 }, g); },
    habichuelas: g => { [[70, 100], [110, 80], [130, 120], [90, 135]].forEach(([x, y], i) => U.el('ellipse', { cx: x, cy: y, rx: 26, ry: 16, transform: `rotate(${i * 35},${x},${y})`, fill: '#8E2C2C', stroke: ink, 'stroke-width': 4 }, g)); },
    cafe: g => { U.el('path', { d: 'M50 80 H 140 V 140 C 140 165 120 175 95 175 C 70 175 50 165 50 140 Z', fill: '#FFFFFF', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M140 95 C 170 95 170 135 140 135', stroke: ink, 'stroke-width': 6, fill: 'none' }, g); U.el('ellipse', { cx: 95, cy: 82, rx: 42, ry: 8, fill: '#6F4518' }, g); },
    refresco: g => { U.el('rect', { x: 65, y: 40, width: 70, height: 135, rx: 12, fill: '#D62828', stroke: ink, 'stroke-width': 5 }, g); U.el('rect', { x: 65, y: 85, width: 70, height: 40, fill: '#FFFFFF' }, g); U.el('rect', { x: 65, y: 40, width: 70, height: 135, rx: 12, fill: 'none', stroke: ink, 'stroke-width': 5 }, g); },
    limon: g => { U.el('ellipse', { cx: 100, cy: 100, rx: 70, ry: 52, fill: '#B5E550', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M30 100 l-12 -6 v12 Z M170 100 l12 -6 v12 Z', fill: '#B5E550', stroke: ink, 'stroke-width': 4 }, g); },
  };
  Object.assign(A, {
    platano_verde: g => { U.el('path', { d: 'M40 70 C 50 140 120 175 170 140 C 175 132 168 128 160 132 C 120 152 72 128 58 70 Z', fill: '#6FA83A', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('path', { d: 'M62 86 C 78 126 116 146 150 138', stroke: '#4E7F27', 'stroke-width': 5, fill: 'none' }, g); U.el('path', { d: 'M38 72 L 34 56 L 46 54 L 58 70', fill: '#3F5A26', stroke: ink, 'stroke-width': 4 }, g); },
    maduro: g => { U.el('path', { d: 'M40 70 C 50 140 120 175 170 140 C 175 132 168 128 160 132 C 120 152 72 128 58 70 Z', fill: '#F2B33D', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); [[80, 118], [110, 140], [140, 142], [64, 96]].forEach(([x, y]) => U.el('ellipse', { cx: x, cy: y, rx: 7, ry: 5, fill: '#5A3A1E' }, g)); U.el('path', { d: 'M38 72 L 34 56 L 46 54 L 58 70', fill: '#3A2614', stroke: ink, 'stroke-width': 4 }, g); },
    tostones: g => { [[70, 80], [130, 80], [100, 135]].forEach(([x, y]) => { U.el('ellipse', { cx: x, cy: y, rx: 42, ry: 34, fill: '#E9B949', stroke: ink, 'stroke-width': 5 }, g); U.el('ellipse', { cx: x, cy: y, rx: 22, ry: 16, fill: '#F6D27A' }, g); }); },
    mangu: g => { U.el('path', { d: 'M30 115 H 170 C 165 162 135 180 100 180 C 65 180 35 162 30 115 Z', fill: '#2A9D8F', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M40 115 C 45 70 155 70 160 115 Z', fill: '#E9D58A', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M60 95 C 80 80 110 80 135 92', stroke: '#9B2D5C', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, g); },
    avena: g => { U.el('path', { d: 'M28 108 H 172 C 166 160 136 182 100 182 C 64 182 34 160 28 108 Z', fill: '#E76F51', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M36 108 C 42 72 158 72 164 108 Z', fill: '#EADBC0', stroke: ink, 'stroke-width': 5 }, g); [[70, 96], [92, 88], [116, 94], [136, 100], [100, 102], [80, 104]].forEach(([x, y], i) => U.el('ellipse', { cx: x, cy: y, rx: 9, ry: 5, transform: `rotate(${i * 30},${x},${y})`, fill: '#C8A46E' }, g)); },
    salami: g => { U.el('path', { d: 'M30 80 C 30 50 170 50 170 80 L 170 120 C 170 150 30 150 30 120 Z', fill: '#B5485D', stroke: ink, 'stroke-width': 5 }, g); U.el('ellipse', { cx: 165, cy: 100, rx: 18, ry: 40, fill: '#E88C99', stroke: ink, 'stroke-width': 5 }, g); [[70, 90], [100, 110], [130, 88], [85, 120]].forEach(([x, y]) => U.el('circle', { cx: x, cy: y, r: 6, fill: '#F6C9CF' }, g)); },
    aceite: g => { U.el('path', { d: 'M86 30 H 114 V 60 C 140 75 145 95 145 120 V 170 H 55 V 120 C 55 95 60 75 86 60 Z', fill: '#F4D35E', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('rect', { x: 82, y: 22, width: 36, height: 14, fill: '#E76F51', stroke: ink, 'stroke-width': 4 }, g); U.el('path', { d: 'M100 100 C 88 116 88 128 100 132 C 112 128 112 116 100 100 Z', fill: '#FFF6E5', opacity: 0.7 }, g); },
    tomate: g => { U.el('circle', { cx: 100, cy: 108, r: 66, fill: '#E63946', stroke: ink, 'stroke-width': 5 }, g); U.el('path', { d: 'M100 46 L 88 30 M100 46 L 112 30 M100 46 L 72 46 M100 46 L 128 46', stroke: '#3E8E41', 'stroke-width': 8, 'stroke-linecap': 'round' }, g); U.el('ellipse', { cx: 76, cy: 90, rx: 10, ry: 16, fill: '#fff', opacity: 0.45 }, g); },
    queso: g => { U.el('path', { d: 'M30 140 L 170 140 L 170 90 L 40 70 Z', fill: '#FFD166', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); [[80, 110], [130, 118], [150, 100]].forEach(([x, y]) => U.el('circle', { cx: x, cy: y, r: 9, fill: '#E9B949' }, g)); },
    guineo: g => { U.el('path', { d: 'M40 70 C 50 140 120 175 170 140 C 175 132 168 128 160 132 C 120 152 72 128 58 70 Z', fill: '#FFE14D', stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); U.el('path', { d: 'M38 72 L 34 56 L 46 54 L 58 70', fill: '#6B4A2F', stroke: ink, 'stroke-width': 4 }, g); },
    canela: g => { [[70, 0], [100, 8], [130, -6]].forEach(([x, r]) => U.el('rect', { x: x - 12, y: 40, width: 24, height: 130, rx: 10, transform: `rotate(${r},${x},100)`, fill: '#A0522D', stroke: ink, 'stroke-width': 4 }, g)); },
    leche_condensada: g => { U.el('rect', { x: 50, y: 60, width: 100, height: 110, rx: 10, fill: '#F1FAEE', stroke: ink, 'stroke-width': 5 }, g); U.el('rect', { x: 50, y: 95, width: 100, height: 40, fill: '#1D3557' }, g); U.el('ellipse', { cx: 100, cy: 60, rx: 50, ry: 12, fill: '#CED4DA', stroke: ink, 'stroke-width': 4 }, g); },
  });
  APE.alimento = (parent, nombre, x, y, size) => { const g = U.el('g', { transform: `translate(${x - size / 2},${y - size / 2}) scale(${size / 200})` }, parent); (A[nombre] || A.manzana)(g); return g; };

  // alimentos que caen, rebotan y reciben un sello (sí / no / con medida)
  APE.escenas.alimentos = function (ctx, d, b) {
    const { W, H, vertical } = ctx, C = T.colores;
    const g = U.el('g', {}, b.cam);
    const items = d.alimentos || [];
    const n = items.length, cols = vertical ? Math.min(2, n) : Math.min(4, n), rows = Math.ceil(n / cols);
    const cw = vertical ? 420 : 380, ch = vertical ? 470 : 420;
    const x0 = W / 2 - (cols - 1) * cw / 2, y0 = (vertical ? H * 0.4 : H * 0.52) - (rows - 1) * ch / 2;
    const size = vertical ? 260 : 230;
    const piso = U.el('g', {}, g);
    const L = items.map((it, i) => {
      const x = x0 + (i % cols) * cw, y = y0 + Math.floor(i / cols) * ch;
      const ig = U.el('g', {}, g);
      const sombra = U.el('ellipse', { cx: x, cy: y + size * 0.5, rx: size * 0.38, ry: 16, fill: '#000', opacity: 0.3 }, piso);
      const plato = U.el('circle', { cx: x, cy: y, r: size * 0.62, fill: C.tarjeta, stroke: C.acento2, 'stroke-width': 5 }, ig);
      const comida = U.el('g', {}, ig); APE.alimento(comida, it.alimento, x, y, size);
      const nombre = U.el('text', { x, y: y + size * 0.62 + 64, 'text-anchor': 'middle', 'font-family': 'InterDisplay', 'font-weight': 900, 'font-size': vertical ? 50 : 46, fill: C.tinta, 'letter-spacing': -0.5 }, ig);
      nombre.textContent = (it.etiqueta || it.alimento).toLocaleUpperCase('es');
      let sello = null;
      if (it.marca) {
        sello = U.el('g', {}, ig);
        const col = it.marca === 'si' ? C.acento2 : it.marca === 'no' ? '#E63946' : C.acento;
        U.el('circle', { cx: x + size * 0.45, cy: y - size * 0.42, r: 44, fill: col, stroke: C.fondo, 'stroke-width': 6 }, sello);
        APE.icono(sello, it.marca === 'si' ? 'check' : it.marca === 'no' ? 'x' : 'alerta', x + size * 0.45, y - size * 0.42, 52, '#FFFFFF');
      }
      return { it, x, y, ig, comida, sombra, sello, t: it.t ?? 0.3 + i * 0.5 };
    });
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: W / 2, y: H / 2, s: 1.06 }, { t: b.dur + 0.6, x: W / 2, y: H / 2, s: 1.0 }]);
    return {
      cajaTexto: vertical ? { x: W / 2, y: H * 0.8, w: W * 0.86, size: 82 * T.tamTexto, anchor: 'middle', vAnchor: 'middle' } : APE.cajaTexto(ctx, 'arriba'),
      update(t) {
        cam(t);
        L.forEach((l, i) => {
          const q = U.p(t, l.t, l.t + 0.7);
          U.show(l.ig, q > 0); U.show(l.sombra, q > 0);
          if (q <= 0) return;
          const caida = q < 0.6 ? -(1 - U.ei(q / 0.6)) * 700 : -Math.abs(Math.sin((q - 0.6) / 0.4 * Math.PI)) * 40 * (1 - q);
          const squash = q > 0.55 && q < 0.75 ? 1 - 0.12 * Math.sin((q - 0.55) / 0.2 * Math.PI) : 1;
          const flota = Math.sin((t - l.t) * 2 + i) * 6;
          l.comida.setAttribute('transform', `translate(0,${caida + flota}) ` + U.sAt(l.x, l.y + 100, 1 / squash, squash) + ` rotate(${Math.sin((t - l.t) * 1.5 + i) * 5},${l.x},${l.y})`);
          l.sombra.setAttribute('rx', 80 * (0.6 + 0.4 * U.p(t, l.t, l.t + 0.45)));
          l.ig.firstChild.setAttribute('opacity', U.p(t, l.t + 0.3, l.t + 0.6));
          if (l.sello) { const qs = U.p(t, l.t + 0.8, l.t + 1.1); U.show(l.sello, qs > 0); l.sello.setAttribute('transform', U.sAt(l.x + 100, l.y - 95, qs < 1 ? 2 - U.ei(qs) : 1)); }
        });
      },
    };
  };

  // plato que se arma por porciones (mitad vegetales, un cuarto proteína, un cuarto carbohidrato…)
  APE.escenas.plato = function (ctx, d, b) {
    const { W, H, vertical } = ctx, C = T.colores;
    const g = U.el('g', {}, b.cam);
    const cx = vertical ? W / 2 : W * 0.62, cy = vertical ? H * 0.38 : H * 0.5, R = vertical ? 380 : 360;
    U.el('circle', { cx, cy: cy + 24, r: R + 40, fill: '#000', opacity: 0.3, filter: 'url(#ape-blur8)' }, g);
    const plato = U.el('circle', { cx, cy, r: R + 40, fill: '#F3EFE6', stroke: ink, 'stroke-width': 6 }, g);
    U.el('circle', { cx, cy, r: R, fill: '#FFFFFF', stroke: '#D9D2C3', 'stroke-width': 4 }, g);
    const porciones = d.porciones || [];
    let ang = -90;
    const P = porciones.map((p, i) => {
      const a0 = ang, a1 = ang + 360 * p.parte; ang = a1;
      const r0 = a0 * Math.PI / 180, r1 = a1 * Math.PI / 180, large = a1 - a0 > 180 ? 1 : 0;
      const dd = `M${cx} ${cy} L${cx + Math.cos(r0) * R * 0.94} ${cy + Math.sin(r0) * R * 0.94} A${R * 0.94} ${R * 0.94} 0 ${large} 1 ${cx + Math.cos(r1) * R * 0.94} ${cy + Math.sin(r1) * R * 0.94} Z`;
      const pg = U.el('g', {}, g);
      U.el('path', { d: dd, fill: p.color || [C.acento2, C.acento, '#F4D35E'][i % 3], stroke: '#FFFFFF', 'stroke-width': 8 }, pg);
      const am = (a0 + a1) / 2 * Math.PI / 180;
      const ix = cx + Math.cos(am) * R * 0.52, iy = cy + Math.sin(am) * R * 0.52;
      if (p.alimento) APE.alimento(pg, p.alimento, ix, iy - 20, R * 0.42);
      const lbl = U.el('text', { x: ix, y: iy + R * 0.28, 'text-anchor': 'middle', 'font-family': 'InterDisplay', 'font-weight': 900, 'font-size': 40, fill: ink }, pg);
      lbl.textContent = (p.etiqueta || '').toLocaleUpperCase('es');
      return { p, pg, ix, iy, am, t: p.t ?? 0.5 + i * 0.9 };
    });
    const cam = APE.camara(b.cam, ctx, [{ t: 0, x: W / 2, y: H / 2, s: 0.94 }, { t: b.dur + 0.6, x: W / 2, y: H / 2, s: 1.04 }]);
    const caja = vertical ? { x: W / 2, y: H * 0.8, w: W * 0.86, size: 82 * T.tamTexto, anchor: 'middle', vAnchor: 'middle' } : { x: 120, y: H * 0.5, w: W * 0.32, size: 88 * T.tamTexto, anchor: 'start', vAnchor: 'middle' };
    return {
      cajaTexto: caja,
      update(t) {
        cam(t);
        plato.setAttribute('transform', U.sAt(cx, cy, U.back(U.p(t, 0, 0.5))));
        P.forEach(p => {
          const q = U.p(t, p.t, p.t + 0.55); U.show(p.pg, q > 0); if (q <= 0) return;
          const off = (1 - U.back(q)) * 260;
          p.pg.setAttribute('transform', `translate(${Math.cos(p.am) * off},${Math.sin(p.am) * off})`);
        });
      },
    };
  };
})();
