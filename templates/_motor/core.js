/* Así Pasó Explicado · motor de animación
   Todo se dibuja en SVG y se controla con APE.seek(t): cada cuadro es determinista,
   así el render cuadro a cuadro (render.py) siempre sale igual. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // ---------- utilidades ----------
  const U = {
    clamp: (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)),
    lerp: (a, b, t) => a + (b - a) * t,
    p: (t, a, b) => (b === a ? (t >= b ? 1 : 0) : U.clamp((t - a) / (b - a))),
    eo: t => 1 - Math.pow(1 - t, 3),
    eoq: t => 1 - Math.pow(1 - t, 5),
    ei: t => t * t * t,
    eio: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    back: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    el(tag, attrs, parent) {
      const e = document.createElementNS(NS, tag);
      if (attrs) for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    },
    uid: (() => { let i = 0; return p => (p || 'id') + (++i); })(),
    rnd(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; },
    wob: (t, f, s = 0) => Math.sin(t * f + s) * 0.6 + Math.sin(t * f * 1.73 + s * 2.1) * 0.4,
    hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; },
    mix(a, b, t) { const A = U.hex2rgb(a), B = U.hex2rgb(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); },
    oscuro: (c, k) => U.mix(c, '#000000', k),
    claro: (c, k) => U.mix(c, '#ffffff', k),
    tr(x, y, s = 1, r = 0) { return `translate(${x},${y}) rotate(${r}) scale(${s})`; },
    // escala alrededor de un punto
    sAt(x, y, sx, sy = sx) { return `translate(${x},${y}) scale(${sx},${sy}) translate(${-x},${-y})`; },
    show(e, v) { e.style.display = v ? '' : 'none'; },
    // dibujo progresivo de trazos (requiere pathLength=1)
    trazo(e, p) { e.setAttribute('stroke-dasharray', '1 1'); e.setAttribute('stroke-dashoffset', 1 - p); },
  };

  // ---------- texto cinético ----------
  // Entra palabra por palabra desde abajo (máscara por línea), nunca queda quieto
  // (crece despacio mientras se oye) y sale hacia arriba antes del siguiente.
  class Texto {
    constructor(parent, ctx, o) {
      this.ctx = ctx; this.o = o;
      const T = ctx.tema, C = T.colores;
      this.g = U.el('g', {}, parent);
      const size = o.size, font = o.font || T.fuentes.titulo, weight = o.weight || T.pesoTitulo || 700;
      let txt = String(o.txt);
      if (o.upper ?? T.mayusculas) txt = txt.toLocaleUpperCase('es');
      const tokens = []; let hl = false;
      let finEspacio = true;
      txt.split(/(\*)/).forEach(part => {
        if (part === '*') { hl = !hl; return; }
        const pegado = part.length && !/^\s/.test(part) && tokens.length && !finEspacio;
        if (part.length) finEspacio = /\s$/.test(part);
        part.split(/\s+/).filter(Boolean).forEach((w, k) => tokens.push({ w, hl, glue: pegado && k === 0 }));
      });
      const attrs = { 'font-family': font, 'font-size': size, 'font-weight': weight, 'letter-spacing': o.ls || T.espaciado || 0 };
      if (o.italic) attrs['font-style'] = 'italic';
      const meas = U.el('text', attrs, this.g);
      meas.textContent = 'a a'; const a1 = meas.getComputedTextLength();
      meas.textContent = 'aa'; const sp = a1 - meas.getComputedTextLength();
      tokens.forEach(tk => { meas.textContent = tk.w; tk.wd = meas.getComputedTextLength(); });
      meas.remove();
      const lines = [[]]; let lw = 0;
      tokens.forEach(tk => {
        const cur = lines[lines.length - 1];
        const add = (cur.length && !tk.glue ? sp : 0) + tk.wd;
        if (lw + add > o.w && cur.length && !tk.glue) { lines.push([tk]); lw = tk.wd; } else { cur.push(tk); lw += add; }
      });
      const lh = size * (o.lh || T.interlinea || 1.05);
      const totalH = lines.length * lh;
      const y0 = o.y - (o.vAnchor === 'middle' ? totalH / 2 : o.vAnchor === 'bottom' ? totalH : 0);
      const marcador = o.marcador || T.marcador;
      this.words = [];
      lines.forEach((ln, li) => {
        const width = ln.reduce((a, tk, i) => a + tk.wd + (i && !tk.glue ? sp : 0), 0);
        let x = o.anchor === 'middle' ? o.x - width / 2 : o.anchor === 'end' ? o.x - width : o.x;
        const top = y0 + li * lh, base = top + size * 0.8;
        const cid = U.uid('cl'); const cp = U.el('clipPath', { id: cid }, ctx.defs);
        U.el('rect', { x: -6000, y: top - size * 0.22, width: 12000, height: lh + size * 0.38 }, cp);
        const lg = U.el('g', { 'clip-path': `url(#${cid})` }, this.g);
        ln.forEach((tk, wi) => {
          if (wi && tk.glue) x -= sp;
          const wg = U.el('g', {}, lg);
          let fill = o.color || C.tinta;
          if (tk.hl) {
            if (marcador === 'caja') {
              tk.box = U.el('rect', { x: x - size * 0.1, y: top + size * 0.02, width: tk.wd + size * 0.2, height: size * 0.92, fill: o.accent || C.acento, rx: T.radioCaja || 0 }, wg);
              fill = C.sobreAcento || '#ffffff';
            } else fill = o.accent || C.acento;
          }
          const te = U.el('text', Object.assign({ x, y: base, fill }, attrs), wg);
          if (T.contorno && !(tk.hl && marcador === 'caja')) {
            te.setAttribute('stroke', T.contorno); te.setAttribute('stroke-width', size * 0.07);
            te.setAttribute('paint-order', 'stroke'); te.setAttribute('stroke-linejoin', 'round');
          }
          te.textContent = tk.w;
          if (tk.hl && marcador === 'subrayado') tk.box = U.el('rect', { x, y: base + size * 0.12, width: tk.wd, height: size * 0.1, fill: o.accent || C.acento, rx: size * 0.05 }, wg);
          this.words.push({ g: wg, tk, x });
          x += tk.wd + sp;
        });
      });
      this.lh = lh; this.cx = o.x; this.cy = y0 + totalH / 2; this.alto = totalH;
    }
    update(t) {
      const o = this.o, t0 = o.t0, t1 = o.t1;
      if (t < t0 - 0.01 || t > t1 + 0.6) { U.show(this.g, false); return; }
      U.show(this.g, true);
      const st = o.stagger ?? 0.065;
      const sc = 1 + 0.04 * U.p(t, t0, t1);
      this.g.setAttribute('transform', U.sAt(this.cx, this.cy, sc));
      const n = this.words.length;
      this.words.forEach((w, i) => {
        const a = t0 + i * st;
        const pi = U.eoq(U.p(t, a, a + 0.5));
        const b = t1 - 0.28 + i * 0.025;
        const po = U.eio(U.p(t, b, b + 0.32));
        const dy = (1 - pi) * this.lh * 1.1 - po * this.lh * 1.1;
        w.g.setAttribute('transform', `translate(0,${dy.toFixed(2)})`);
        w.g.setAttribute('opacity', (Math.min(pi * 1.6, 1) * (1 - po)).toFixed(3));
        if (w.tk.box) {
          const bp = U.eo(U.p(t, a + 0.22, a + 0.55));
          w.tk.box.setAttribute('transform', U.sAt(w.x, 0, Math.max(bp, 0.001), 1));
        }
      });
    }
  }

  // ---------- cámara ----------
  function camara(g, ctx, keys, drift = 1) {
    keys = keys.slice().sort((a, b) => a.t - b.t);
    return t => {
      let k0 = keys[0], k1 = keys[keys.length - 1];
      for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i].t && t <= keys[i + 1].t) { k0 = keys[i]; k1 = keys[i + 1]; break; }
      if (t < keys[0].t) k1 = k0;
      const q = k1 === k0 ? 0 : U.eio(U.p(t, k0.t, k1.t));
      const x = U.lerp(k0.x, k1.x, q) + U.wob(t, 0.5, 1) * 6 * drift;
      const y = U.lerp(k0.y, k1.y, q) + U.wob(t, 0.43, 4) * 5 * drift;
      const s = U.lerp(k0.s, k1.s, q) * (1 + 0.004 * drift * U.wob(t, 0.3, 7));
      const r = U.lerp(k0.r || 0, k1.r || 0, q);
      g.setAttribute('transform', `translate(${ctx.W / 2},${ctx.H / 2}) rotate(${r}) scale(${s}) translate(${-x},${-y})`);
    };
  }

  // ---------- transiciones ----------
  const TRANS = {
    corte_diagonal(ctx, s, p) {
      const { W, H } = ctx, k = U.eio(p), sk = H * 0.32;
      const edge = U.lerp(-sk - 60, W + sk + 60, k);
      const pts = `-50,-50 ${edge + sk},-50 ${edge - sk},${H + 50} -50,${H + 50}`;
      s.clipShape.setAttribute('points', pts);
      const bw = 26;
      ctx.trans.innerHTML = '';
      U.el('polygon', { points: `${edge + sk},-50 ${edge + sk + bw},-50 ${edge - sk + bw},${H + 50} ${edge - sk},${H + 50}`, fill: ctx.tema.colores.acento }, ctx.trans);
      U.el('polygon', { points: `${edge + sk + bw},-50 ${edge + sk + bw + 6},-50 ${edge - sk + bw + 6},${H + 50} ${edge - sk + bw},${H + 50}`, fill: ctx.tema.colores.tinta, opacity: 0.85 }, ctx.trans);
    },
    quemado(ctx, s, p) {
      const { W, H } = ctx, k = U.eio(p), R = Math.hypot(W, H) * 0.62 * k;
      const cx = W * 0.5, cy = H * 0.5; let d = '';
      for (let i = 0; i <= 72; i++) {
        const a = i / 72 * Math.PI * 2;
        const r = R * (1 + 0.09 * Math.sin(a * 7 + 1.3) + 0.06 * Math.sin(a * 13 + 4) + 0.04 * Math.sin(a * 23));
        d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1);
      }
      d += 'Z';
      s.clipShape.setAttribute('d', d);
      ctx.trans.innerHTML = '';
      U.el('path', { d, fill: 'none', stroke: ctx.tema.colores.brasa || '#c8641e', 'stroke-width': 26, opacity: 0.55, filter: 'url(#ape-blur8)' }, ctx.trans);
      U.el('path', { d, fill: 'none', stroke: ctx.tema.colores.tintaOscura || '#3b2412', 'stroke-width': 7, opacity: 0.9 }, ctx.trans);
    },
    circulo(ctx, s, p) {
      const { W, H } = ctx, k = U.eio(p), R = Math.hypot(W, H) * 0.75 * k;
      const cx = W * 0.5, cy = H * 0.5;
      s.clipShape.setAttribute('d', `M${cx - R},${cy}a${R},${R} 0 1,0 ${2 * R},0a${R},${R} 0 1,0 ${-2 * R},0Z`);
      ctx.trans.innerHTML = '';
      U.el('circle', { cx, cy, r: R, fill: 'none', stroke: ctx.tema.colores.acento, 'stroke-width': 22 * (1 - k * 0.5) }, ctx.trans);
      U.el('circle', { cx, cy, r: Math.max(R - 40, 0), fill: 'none', stroke: ctx.tema.colores.acento2, 'stroke-width': 8 }, ctx.trans);
    },
    persiana(ctx, s, p) {
      const { W, H } = ctx, n = 7, bw = W / n;
      let d = ''; ctx.trans.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const k = U.eio(U.p(p, i * 0.07, i * 0.07 + 0.55));
        const h = H * k, y = ctx.vertical ? 0 : (i % 2 ? H - h : 0);
        d += `M${i * bw - 1},${y}h${bw + 2}v${h}h${-bw - 2}Z`;
        if (k > 0 && k < 1) U.el('rect', { x: i * bw, y: i % 2 && !ctx.vertical ? y - 10 : y + h - 4, width: bw, height: 14, fill: i % 2 ? ctx.tema.colores.acento2 : ctx.tema.colores.acento }, ctx.trans);
      }
      s.clipShape.setAttribute('d', d || 'M0,0Z');
    },
  };

  // ---------- registro ----------
  const APE = { U, Texto, camara, escenas: {}, superpuestos: {}, temas: {}, ctx: null };
  window.APE = APE;

  // cajas de texto por formato
  APE.cajaTexto = function (ctx, zona) {
    const { W, H, vertical } = ctx; const T = ctx.tema;
    const big = T.tamTexto || 1;
    const Z = {
      izquierda: vertical ? { x: W / 2, y: H * 0.69, w: W * 0.84, size: 92 * big, anchor: 'middle', vAnchor: 'middle' }
        : { x: 150, y: H * 0.5, w: W * 0.4, size: 104 * big, anchor: 'start', vAnchor: 'middle' },
      abajo: vertical ? { x: W / 2, y: H * 0.7, w: W * 0.84, size: 90 * big, anchor: 'middle', vAnchor: 'middle' }
        : { x: W / 2, y: H * 0.835, w: W * 0.8, size: 84 * big, anchor: 'middle', vAnchor: 'middle' },
      arriba: vertical ? { x: W / 2, y: H * 0.2, w: W * 0.84, size: 84 * big, anchor: 'middle', vAnchor: 'middle' }
        : { x: W / 2, y: H * 0.15, w: W * 0.8, size: 92 * big, anchor: 'middle', vAnchor: 'middle' },
      centro: vertical ? { x: W / 2, y: H * 0.47, w: W * 0.86, size: 128 * big, anchor: 'middle', vAnchor: 'middle' }
        : { x: W / 2, y: H * 0.5, w: W * 0.78, size: 150 * big, anchor: 'middle', vAnchor: 'middle' },
    };
    return Object.assign({}, Z[zona] || Z.abajo);
  };

  function ruidoDataURL(seed) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'); const im = x.createImageData(256, 256); const r = U.rnd(seed);
    for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    x.putImageData(im, 0, 0); return c.toDataURL();
  }

  APE.init = async function (cfg) {
    const formato = cfg.formato || 'youtube';
    const vertical = formato === 'redes';
    const W = vertical ? 1080 : 1920, H = vertical ? 1920 : 1080;
    const tema = APE.temas[cfg.serie];
    if (!tema) throw new Error('Serie sin plantilla: ' + cfg.serie);
    const fams = Object.values(tema.fuentes);
    await Promise.all(fams.flatMap(f => [document.fonts.load(`700 40px "${f}"`), document.fonts.load(`400 40px "${f}"`)]));
    await document.fonts.ready;

    document.body.innerHTML = '';
    document.body.style.cssText = `margin:0;background:${tema.colores.fondo};overflow:hidden;width:${W}px;height:${H}px`;
    const svg = U.el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, xmlns: NS });
    document.body.appendChild(svg);
    const defs = U.el('defs', {}, svg);
    const f8 = U.el('filter', { id: 'ape-blur8', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    U.el('feGaussianBlur', { stdDeviation: 8 }, f8);
    const f30 = U.el('filter', { id: 'ape-blur30', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    U.el('feGaussianBlur', { stdDeviation: 30 }, f30);
    const sh = U.el('filter', { id: 'ape-sombra', x: '-20%', y: '-20%', width: '140%', height: '150%' }, defs);
    U.el('feDropShadow', { dx: 0, dy: 14, stdDeviation: 16, 'flood-color': '#000', 'flood-opacity': 0.45 }, sh);

    const data = cfg.escenas;
    const ctx = APE.ctx = {
      W, H, vertical, formato, tema, defs, svg, data, serie: cfg.serie,
      personajes: data.personajes || {},
      fondo: U.el('g', {}, svg), capa: null, trans: null, sup: null,
    };
    ctx.capa = U.el('g', {}, svg);
    ctx.trans = U.el('g', {}, svg);
    ctx.sup = U.el('g', {}, svg);
    const fin = U.el('g', { 'pointer-events': 'none' }, svg);

    // fondo vivo del tema
    ctx.updFondo = tema.fondo ? tema.fondo(ctx, ctx.fondo) : () => { };

    // escenas
    const TR = tema.duracionTransicion || 0.6;
    ctx.TR = TR;
    const lista = data.escenas.map((d, i) => Object.assign({ idx: i }, d));
    lista.forEach((d, i) => {
      if (d.fin == null) d.fin = lista[i + 1] ? lista[i + 1].inicio : d.inicio + 4;
      d.dur = d.fin - d.inicio;
    });
    ctx.escenas = lista.map((d, i) => {
      const outer = U.el('g', {}, ctx.capa);
      const g = U.el('g', {}, outer);
      const cid = U.uid('sc'); const cp = U.el('clipPath', { id: cid }, defs);
      const tipoT = d.transicion || tema.transicion;
      const clipShape = U.el(tipoT === 'corte_diagonal' ? 'polygon' : 'path', {}, cp);
      const cam = U.el('g', {}, g);
      const txt = U.el('g', {}, g);
      const fab = APE.escenas[d.tipo];
      if (!fab) throw new Error('Tipo de escena desconocido: ' + d.tipo);
      const base = { g, cam, txt, dur: d.dur, d, i };
      const sc = fab(ctx, d, base) || {};
      const textos = [];
      const beats = (d.texto || []).map(b => (typeof b === 'string' ? { t: 0.2, txt: b } : b));
      beats.forEach((b, k) => {
        const caja = Object.assign({}, sc.cajaTexto || APE.cajaTexto(ctx, d.zonaTexto || 'abajo'), b.caja || {});
        if (b.tam) caja.size *= b.tam;
        const t1 = b.hasta ?? (beats[k + 1] ? beats[k + 1].t : d.dur - 0.15);
        textos.push(new Texto(txt, ctx, Object.assign({}, caja, { txt: b.txt, t0: b.t, t1, color: b.color, italic: b.italic })));
      });
      U.show(outer, false);
      return { d, outer, g, cid, clipShape, tipoT, upd: sc.update || (() => { }), textos, ultima: i === lista.length - 1 };
    });

    // superpuestos (aviso de compartir, etc.)
    ctx.sups = (data.superpuestos || []).map(d => {
      const g = U.el('g', {}, ctx.sup);
      const fab = APE.superpuestos[d.tipo];
      const u = fab ? fab(ctx, d, g) : () => { };
      U.show(g, false);
      return { d, g, u };
    });

    // grano + viñeta + marca
    if (tema.grano) {
      const pid = U.uid('gr'); const pat = U.el('pattern', { id: pid, width: 256, height: 256, patternUnits: 'userSpaceOnUse' }, defs);
      U.el('image', { href: ruidoDataURL(7), width: 256, height: 256 }, pat);
      ctx.granoPat = pat;
      U.el('rect', { width: W, height: H, fill: `url(#${pid})`, opacity: tema.grano, style: 'mix-blend-mode:overlay' }, fin);
    }
    if (tema.vineta !== 0) {
      const vid = U.uid('vi'); const rg = U.el('radialGradient', { id: vid, cx: '50%', cy: '50%', r: '75%' }, defs);
      U.el('stop', { offset: '55%', 'stop-color': '#000', 'stop-opacity': 0 }, rg);
      U.el('stop', { offset: '100%', 'stop-color': tema.colorVineta || '#000', 'stop-opacity': tema.vineta ?? 0.55 }, rg);
      U.el('rect', { width: W, height: H, fill: `url(#${vid})` }, fin);
    }
    if (tema.marca !== false) {
      const m = U.el('text', {
        x: vertical ? W / 2 : W - 60, y: vertical ? 150 : 70, 'text-anchor': vertical ? 'middle' : 'end',
        'font-family': tema.fuentes.texto, 'font-size': vertical ? 34 : 28, 'font-weight': 700, fill: tema.colores.tinta, opacity: 0.55, 'letter-spacing': 2
      }, fin);
      m.textContent = '@asipasoexplicado';
    }

    ctx.duracion = data.duracion || lista[lista.length - 1].fin;
    APE.seek(0);
    return { W, H, duracion: ctx.duracion, beats: APE.beats() };
  };

  // momentos de cambio visual (para validar la regla de 3–5 s)
  APE.beats = function () {
    const ctx = APE.ctx, out = [];
    ctx.escenas.forEach(s => {
      const d = s.d; out.push(d.inicio);
      (d.texto || []).forEach(b => out.push(d.inicio + (b.t ?? 0)));
      ['puntos', 'hitos', 'items', 'cambios', 'barras', 'organos', 'alimentos', 'nombres'].forEach(k => (d[k] || []).forEach(x => { if (x && x.t != null) out.push(d.inicio + x.t); }));
      if (d.enfoque && d.enfoque.t != null) out.push(d.inicio + d.enfoque.t);
      if (['retrato', 'escenario', 'versiculo', 'arca', 'tronos', 'cuerpo'].includes(d.tipo)) { for (let k = 3.5; k < d.dur; k += (d.tipo === 'versiculo' ? 3 : 3.5)) out.push(d.inicio + k); }
    });
    return out.sort((a, b) => a - b);
  };

  APE.seek = function (t) {
    const ctx = APE.ctx; if (!ctx) return;
    ctx.t = t;
    ctx.updFondo(t);
    if (ctx.granoPat) { const f = Math.floor(t * 24); ctx.granoPat.setAttribute('patternTransform', `translate(${(f * 97) % 256},${(f * 61) % 256})`); }
    const TR = ctx.TR;
    let transActiva = false;
    ctx.escenas.forEach((s, i) => {
      const d = s.d;
      const fin = s.ultima ? d.fin + 0.001 : d.fin + TR;
      const vis = t >= d.inicio && t < fin;
      U.show(s.outer, vis);
      if (!vis) return;
      const lt = t - d.inicio;
      s.upd(lt);
      s.textos.forEach(x => x.update(lt));
      const pIn = i > 0 ? U.p(lt, 0, TR) : 1;
      if (pIn < 1) {
        s.g.setAttribute('clip-path', `url(#${s.cid})`);
        (TRANS[s.tipoT] || TRANS.corte_diagonal)(ctx, s, pIn);
        transActiva = true;
      } else s.g.removeAttribute('clip-path');
      if (t > d.fin && !s.ultima) {
        const q = U.p(t, d.fin, d.fin + TR);
        s.outer.setAttribute('transform', U.sAt(ctx.W / 2, ctx.H / 2, 1 + 0.07 * U.ei(q)));
      } else s.outer.removeAttribute('transform');
    });
    if (!transActiva) ctx.trans.innerHTML = '';
    ctx.sups.forEach(s => {
      const vis = t >= s.d.inicio && t < s.d.fin + 0.5;
      U.show(s.g, vis);
      if (vis) s.u(t - s.d.inicio, s.d.fin - s.d.inicio);
    });
  };
})();
