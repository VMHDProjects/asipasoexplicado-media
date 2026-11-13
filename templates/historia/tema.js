/* Plantilla: Historia de RD — 7:00 a. m. · palabra "Historia"
   Estilo propio: cartel de época nocturno. Azul tinta, rojo carmesí, crema de archivo, oro viejo.
   Medallones ilustrados, mapas de pergamino, corte diagonal rojo entre escenas. */
(function () {
  const { U } = APE;
  APE.temas.historia = {
    nombre: 'Historia de RD',
    palabra: 'Historia',
    colores: {
      fondo: '#0B1631', tinta: '#F4EAD5', acento: '#E03140', acento2: '#F2B33D', sobreAcento: '#FFFFFF', dorado: '#E2B04A',
      mar: '#10284D', tierra: '#E9D8B2', costa: '#0A0F1E', reticula: '#7FA2D6', frontera: '#E03140', etiqueta: '#3A2A1C',
      etiquetaPin: '#F4EAD5', contornoTexto: '#0B1631', contornoPin: '#0A0F1E', ruta: '#F2B33D',
      fondoRetrato: '#16264A', rayasRetrato: '#F4EAD5', tarjeta: '#13224A',
    },
    fuentes: { titulo: 'HerosCn', texto: 'HerosCn', serif: 'Bonum', cifra: 'Bonum' },
    mayusculas: true, marcador: 'caja', contorno: '#0B1631', espaciado: 1,
    transicion: 'corte_diagonal', duracionTransicion: 0.55, marcoRetrato: 'medallon',
    grano: 0.09, vineta: 0.6,
    escenario: {
      cielo: ['#1D2B53', '#E9925B'], sol: '#FFD27A', lejos: '#3B4A74', medio: '#4d5a3a', tierra: '#6B4B36',
      casas: ['#D9B48F', '#8FB0C9', '#E6D3A8', '#C96F5D', '#9CC0A0'], tejado: '#8E3B2E', iglesia: '#EADFC6',
      tinta: '#1A1210', silueta: '#120D10', hojas: '#2E5E3E', tronco: '#5C3D27', ventana: '#FFD88A',
      persiana: '#2F6B5A', puerta: '#3B2418', nube: '#F6C9A8', mar: '#24496e', piedra: '#B9A27E', paja: '#B88B4A',
    },
    fondo(ctx, g) {
      const { W, H } = ctx;
      const gid = U.uid('hf'); const rg = U.el('radialGradient', { id: gid, cx: '50%', cy: '40%', r: '80%' }, ctx.defs);
      U.el('stop', { offset: 0, 'stop-color': '#1A2C5C' }, rg); U.el('stop', { offset: 1, 'stop-color': '#050A1A' }, rg);
      U.el('rect', { width: W, height: H, fill: `url(#${gid})` }, g);
      const pid = U.uid('hp'); const pat = U.el('pattern', { id: pid, width: 22, height: 22, patternUnits: 'userSpaceOnUse' }, ctx.defs);
      U.el('circle', { cx: 11, cy: 11, r: 2.2, fill: '#F4EAD5' }, pat);
      const puntos = U.el('rect', { x: -44, y: -44, width: W + 88, height: H + 88, fill: `url(#${pid})`, opacity: 0.06 }, g);
      const l1 = U.el('circle', { r: W * 0.35, fill: '#E03140', opacity: 0.16, filter: 'url(#ape-blur30)' }, g);
      const l2 = U.el('circle', { r: W * 0.3, fill: '#3E6FC4', opacity: 0.16, filter: 'url(#ape-blur30)' }, g);
      const r = U.rnd(5);
      const motas = Array.from({ length: 36 }, () => ({ e: U.el('circle', { r: 1 + r() * 2.5, fill: '#F4EAD5' }, g), x: r() * W, y: r() * H, v: 8 + r() * 22, f: r() * 6 }));
      return t => {
        puntos.setAttribute('transform', `translate(${(t * 6) % 22},${(t * 3) % 22})`);
        l1.setAttribute('cx', W * (0.2 + 0.1 * Math.sin(t * 0.21))); l1.setAttribute('cy', H * (0.8 + 0.1 * Math.cos(t * 0.17)));
        l2.setAttribute('cx', W * (0.85 + 0.08 * Math.cos(t * 0.19))); l2.setAttribute('cy', H * (0.15 + 0.1 * Math.sin(t * 0.23)));
        motas.forEach(m => { m.e.setAttribute('cx', m.x + Math.sin(t * 0.5 + m.f) * 20); m.e.setAttribute('cy', ((m.y - t * m.v) % H + H) % H); m.e.setAttribute('opacity', 0.15 + 0.25 * Math.abs(Math.sin(t + m.f))); });
      };
    },
    // franjas de la bandera que barren detrás del titular
    decorTitular(ctx, g) {
      const { W, H, vertical } = ctx;
      const f = U.el('g', { opacity: 0.9 }, g);
      const cols = ['#1F4FA3', '#F4EAD5', '#E03140'];
      const bandas = cols.map((c, i) => U.el('rect', { height: vertical ? 26 : 22, fill: c }, f));
      return t => bandas.forEach((b, i) => {
        const q = U.eoq(U.p(t, 0.15 + i * 0.08, 0.9 + i * 0.08));
        const y = (vertical ? H * 0.255 : H * 0.17) + i * (vertical ? 34 : 30);
        b.setAttribute('x', W * 0.5 - W * 0.32 * q); b.setAttribute('width', W * 0.64 * q); b.setAttribute('y', y);
        b.setAttribute('opacity', 1 - U.p(t, 3.5, 4.2) * 0.5);
      });
    },
  };
})();
