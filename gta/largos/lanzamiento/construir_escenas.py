#!/usr/bin/env python3
"""Arma escenas.json de "GTA 6: Lo que NADIE te ha contado antes del lanzamiento" a partir de frases.json."""
import json, os, re
AQUI = os.path.dirname(os.path.abspath(__file__))
fr = json.load(open(os.path.join(AQUI, 'frases.json'), encoding='utf-8'))
fr = fr if isinstance(fr, list) else fr['frases']
DUR = 440.03

def T(i, f=0.0):
    a, b = fr[i]['ini'], fr[i]['fin']
    return round(max(0, a + (b - a) * f - (0.12 if f == 0 else 0)), 2)

R = [255, 46, 136]; C = [25, 227, 255]; A = [255, 212, 0]; M = [123, 44, 255]; N = [255, 138, 0]; RJ = [240, 40, 60]; VD = [60, 240, 140]
ROJOS = [[120, 0, 20], [240, 40, 60]]

P = []  # (inicio, escena)
def S(t, fondo, tipo, **kw):
    d = dict(inicio=t, fondo=fondo, tipo=tipo); d.update(kw); P.append(d)

# --- El detalle
S(0.0, 'franjas', 'telefono', variante='martillo', txt='1er TRÁILER · ¿LO NOTASTE?')
S(T(1), 'ciudad', 'telefono', variante='martillo', txt='LA MUJER DEL MARTILLO')
S(T(2), 'tech', 'icono', icono='mando', txt='¿INVENTADA PARA EL JUEGO?')
S(T(3), 'rayos', 'titulo', txt='*NO* LO ES', paleta=ROJOS)
S(T(4), 'ciudad', 'telefono', variante='martillo', txt='VIDA REAL · FLORIDA', rot=4)
S(T(4, 0.55), 'mapa', 'mapa', foco='todo', titulo='FLORIDA', marcar=['vicecity'])
S(T(5), 'circuitos', 'icono', icono='candado', txt='SECRETO Nº 1')
S(T(6), 'grid', 'icono', icono='pin', txt='¿DÓNDE OCURRE?')
S(T(6, 0.27), 'anillos', 'pareja', medio='pregunta', a='¿?', b='¿?', txt='¿QUIÉNES SON?')
S(T(6, 0.55), 'tech', 'icono', icono='arena', txt='¿POR QUÉ TANTA ESPERA?')
S(T(6, 0.78), 'rayos', 'icono', icono='ojo', txt='LO QUE ESCONDEN')
S(T(7), 'franjas', 'titulo', txt='QUÉDATE HASTA EL *FINAL*', icono='reloj')
# --- Diez años de espera
S(T(8), 'tech', 'icono', icono='reloj', txt='VOLVAMOS ATRÁS')
S(T(8, 0.55), 'grid', 'fecha', mes='SEP', dia=17, anio=2013, txt='SALE GTA V')
S(T(9), 'ciudad', 'icono', icono='mando', txt='GTA V · 2013')
S(T(9, 0.45), 'rayos', 'contador', desde=0, hasta=1000, prefijo='$', sufijo=' M', txt='EN SOLO 3 DÍAS', icono='dinero')
S(T(10), 'franjas', 'icono', icono='trofeo', txt='EL MAYOR ESTRENO DE SU ÉPOCA')
S(T(11), 'tech', 'icono', icono='pelicula', txt='MÁS QUE CUALQUIER PELÍCULA')
S(T(12), 'anillos', 'icono', icono='vinilo', txt='MÁS QUE CUALQUIER DISCO')
S(T(13), 'rayos', 'titulo', txt='LO QUE *NADIE* ESPERABA')
S(T(13, 0.68), 'circuitos', 'icono', icono='silencio', txt='SILENCIO TOTAL')
S(T(14), 'grid', 'linea_tiempo', hitos=[dict(anio='1 AÑO', txt='2014', t=0.1), dict(anio='5 AÑOS', txt='2018', t=1.0), dict(anio='10 AÑOS', txt='2023', t=2.0)])
S(T(15), 'ciudad', 'galeria', items=[dict(silueta='hombre'), dict(silueta='mujer'), dict(silueta='gorra'), dict(silueta='hombre'), dict(silueta='mujer')], txt='UNA GENERACIÓN ENTERA')
S(T(15, 0.55), 'anillos', 'titulo', txt='¿Y EL *SEIS*?', icono='pregunta')
# --- La filtración
S(T(16), 'tech', 'icono', icono='reloj', txt='POR FIN... PERO NO ASÍ')
S(T(17), 'grid', 'fecha', mes='DIC', dia=5, anio=2023, txt='TRÁILER 1 · PLANEADO')
S(T(18), 'circuitos', 'icono', icono='laptop', txt='¡FILTRADO!', paleta=[RJ, N])
S(T(19), 'franjas', 'icono', icono='reloj', txt='HORAS ANTES DE LO PREVISTO')
S(T(20), 'rayos', 'titulo', txt='¿Y SABES QUÉ *PASÓ*?')
S(T(21), 'anillos', 'icono', icono='cohete', txt='NADA LO FRENÓ')
S(T(22), 'tech', 'icono', icono='play', txt='TRÁILER 1')
S(T(22, 0.42), 'rayos', 'contador', desde=0, hasta=200, prefijo='+', sufijo=' M', txt='REPRODUCCIONES', icono='ojo', dur=2.2)
S(T(22, 0.8), 'franjas', 'icono', icono='trofeo', txt='DE LOS MÁS VISTOS DE LA HISTORIA')
S(T(23), 'ciudad', 'icono', icono='arena', txt='LA ESPERA SIGUE')
S(T(24), 'grid', 'linea_tiempo', hitos=[dict(anio='2025', txt='PROMETIDO', t=0.1, tachado=1.6), dict(anio='MAY 2026', txt='RETRASO', t=round(T(25) - T(24), 2), tachado=round(T(25) - T(24) + 1.6, 2)),
                                         dict(anio='19 NOV 2026', txt='LA FECHA', t=round(T(26) - T(24), 2))])
S(T(26, 0.45), 'rayos', 'fecha', mes='NOV', dia=19, anio=2026, txt='EL DÍA', sello='CONFIRMADO', tsello=2.6)
S(T(27), 'franjas', 'titulo', txt='19.11.2026', sub='ESTA VEZ VA EN SERIO', tsub=1.3)
# --- Leonida
S(T(29), 'circuitos', 'icono', icono='pin', txt='¿A DÓNDE NOS LLEVA?')
S(T(30), 'mapa', 'mapa', foco='todo', revelar=2.5, titulo='UNA FLORIDA MÁS LOCA', ttitulo=2.6)
S(T(31), 'mapa', 'mapa', foco='todo', titulo='*LEONIDA*', ttitulo=0.1)
S(T(32), 'ciudad', 'icono', icono='palmera', txt='SU CORAZÓN...')
S(T(33), 'ciudad', 'titulo', txt='*VICE CITY*', paleta=[R, C], size=120)
S(T(34), 'grid', 'linea_tiempo', hitos=[dict(anio='2002', txt='VICE CITY', t=0.1), dict(anio='2026', txt='GIGANTE Y MODERNA', t=1.6)])
S(T(34, 0.5), 'mapa', 'mapa', desde='todo', foco='vicecity', zoom=2.6)
S(T(35), 'mapa', 'mapa', desde='vicecity', foco='todo', titulo='UN ESTADO COMPLETO', ttitulo=1.2)
S(T(37), 'mapa', 'mapa', desde='todo', foco='cayos', zoom=2.4)
S(T(37, 0.55), 'franjas', 'icono', icono='sol', txt='AGUAS TURQUESA')
S(T(38), 'mapa', 'mapa', desde='cayos', foco='grassrivers')
S(T(38, 0.55), 'circuitos', 'icono', icono='caiman', txt='LOS CAIMANES NO SON DECORACIÓN')
S(T(39), 'mapa', 'mapa', desde='grassrivers', foco='portgellhorn')
S(T(40), 'mapa', 'mapa', desde='portgellhorn', foco='ambrosia')
S(T(41), 'mapa', 'mapa', desde='ambrosia', foco='kalaga')
S(T(41, 0.6), 'franjas', 'icono', icono='montana', txt='BOSQUES Y MONTAÑAS')
S(T(42), 'anillos', 'iconos', items=[dict(icono='ciudad', txt='CIUDAD', t=0), dict(icono='sol', txt='PLAYA', t=0.35), dict(icono='caiman', txt='PANTANO', t=0.75), dict(icono='campo', txt='CAMPO', t=1.2), dict(icono='montana', txt='MONTAÑA', t=1.65)])
S(T(43), 'mapa', 'mapa', desde='kalaga', foco='todo', marcar=['kalaga', 'portgellhorn', 'ambrosia', 'grassrivers', 'vicecity', 'cayos'], paso=0.12, titulo='TODO *TUYO*', ttitulo=1.7)
# compartir a mitad
S(T(45), 'rayos', 'compartir', t2=2.6)
# --- Lucia y Jason
S(T(46), 'franjas', 'titulo', txt='LO QUE *CAMBIA* TODO')
S(T(47), 'anillos', 'ficha', silueta='mujer', nombre='¿QUIÉN ES?', rol='1ª PROTAGONISTA MUJER', color=R, extra='pregunta')
S(T(48), 'ciudad', 'ficha', silueta='mujer', nombre='LUCIA CAMINOS', rol='PROTAGONISTA', color=R)
S(T(49), 'franjas', 'icono', icono='guantes', txt='PELEA DESDE NIÑA')
S(T(49, 0.5), 'tech', 'icono', icono='rejas', txt='TERMINÓ EN PRISIÓN', paleta=[RJ, M])
S(T(50), 'grid', 'ficha', silueta='mujer', nombre='LUCIA CAMINOS', rol='META: NO VOLVER A CAER', color=R, datos=[dict(t=1.6, txt='SALE DE PRISIÓN')])
S(T(51), 'circuitos', 'ficha', silueta='hombre', nombre='???', rol='OTROS PLANES', color=C, extra='pregunta')
S(T(52), 'ciudad', 'ficha', silueta='hombre', nombre='JASON DUVAL', rol='PROTAGONISTA', color=C)
S(T(53), 'tech', 'iconos', items=[dict(icono='cartas', txt='ESTAFADORES', t=0), dict(icono='estrella', txt='EJÉRCITO', t=2.0), dict(icono='palmera', txt='LOS CAYOS', t=3.6), dict(icono='maletin', txt='TRABAJOS SUCIOS', t=5.2)])
S(T(54), 'anillos', 'pareja', txt='DOS PERSONAS *ROTAS*', medio='corazon')
S(T(55), 'ciudad', 'icono', icono='maletin', txt='UN TRABAJO SENCILLO...')
S(T(55, 0.5), 'rayos', 'icono', icono='sirena', txt='...SALE MAL', paleta=ROJOS)
S(T(56), 'franjas', 'pareja', a='BONNIE', b='CLYDE', txt='LA PAREJA CRIMINAL MÁS FAMOSA', medio='rayo')
S(T(56, 0.6), 'grid', 'icono', icono='dinero', txt='ROBOS EN LOS AÑOS 30')
S(T(57), 'tech', 'icono', icono='lapida', txt='NO TERMINÓ BIEN')
S(T(58), 'anillos', 'pareja', txt='¿TERMINARÁ *IGUAL*?', medio='pregunta')
# --- Los que los rodean
S(T(59), 'grid', 'pareja', txt='NO ESTÁN *SOLOS*', medio='rayo')
S(T(60), 'tech', 'galeria', items=[dict(silueta='gorra', txt='CAL'), dict(silueta='hombre', txt='BOOBIE'), dict(silueta='hombre', txt="DRE'QUAN"), dict(silueta='dos_mujeres', txt='REAL DIMEZ'), dict(silueta='hombre', txt='RAUL'), dict(silueta='gorra', txt='BRIAN')], paso=0.7, txt='CADA UNO ESCONDE ALGO')
S(T(61), 'circuitos', 'ficha', silueta='gorra', nombre='CAL HAMPTON', rol='AMIGO DE JASON', color=VD, datos=[dict(t=2.2, txt='ESCUCHA LA RADIO DE LA POLICÍA'), dict(t=4.6, txt='NO CONFÍA NI EN SU SOMBRA')])
S(T(62), 'ciudad', 'ficha', silueta='hombre', nombre='BOOBIE IKE', rol='DUEÑO DE MEDIO VICE CITY', color=A)
S(T(62, 0.45), 'franjas', 'iconos', items=[dict(icono='club', txt='CLUB', t=0), dict(icono='microfono', txt='ESTUDIO', t=0.7), dict(icono='edificios', txt='PROPIEDADES', t=1.5)])
S(T(63), 'tech', 'ficha', silueta='hombre', nombre="DRE'QUAN PRIEST", rol='PRODUCTOR', color=M, datos=[dict(t=2.6, txt='QUIERE UNA MÁQUINA DE ÉXITOS')])
S(T(64), 'anillos', 'ficha', silueta='dos_mujeres', nombre='REAL DIMEZ', rol='DÚO DE RAPERAS', color=R, datos=[dict(t=2.2, txt='A CUALQUIER PRECIO')])
S(T(65), 'grid', 'ficha', silueta='hombre', nombre='RAUL BAUTISTA', rol='LADRÓN DE BANCOS', color=N, datos=[dict(t=2.0, txt='EL MÁS EXPERIMENTADO')])
S(T(66), 'circuitos', 'ficha', silueta='gorra', nombre='BRIAN HEDER', rol='TRAFICANTE VETERANO', color=RJ, datos=[dict(t=2.4, txt='JASON TRABAJA PARA ÉL')])
S(T(67), 'rayos', 'titulo', txt='¿EL *ALIADO*...', paleta=[M, R])
S(T(67, 0.55), 'rayos', 'titulo', txt='...ES EL *TRAIDOR*?', paleta=ROJOS)
S(T(68), 'anillos', 'galeria', items=[dict(silueta='gorra'), dict(silueta='hombre'), dict(silueta='hombre'), dict(silueta='dos_mujeres'), dict(silueta='hombre'), dict(silueta='gorra')], paso=0.08, preguntas=0.8, txt='MIRA BIEN ESTAS CARAS')
# --- El espejo de Florida
S(T(70), 'ciudad', 'telefono', variante='martillo', txt='¿RECUERDAS ESTO?')
S(T(72), 'tech', 'telefono', variantes=['pelea', 'martillo', 'fiesta'], txt='VIDEOS VERTICALES EN EL TRÁILER')
S(T(72, 0.5), 'franjas', 'iconos', items=[dict(icono='corazon', txt='LIKES', t=0), dict(icono='comentario', txt='COMENTARIOS', t=0.5), dict(icono='compartir', txt='VIRAL', t=1.0)])
S(T(73), 'grid', 'telefono', variante='pelea', txt='PELEAS EN LA CALLE')
S(T(73, 0.45), 'circuitos', 'telefono', variante='caiman', txt='ANIMALES EXÓTICOS')
S(T(73, 0.75), 'rayos', 'telefono', variante='fiesta', txt='FIESTAS EN LA PLAYA')
S(T(74), 'ciudad', 'telefono', variantes=['martillo', 'martillo'], etiquetas=['REAL', 'JUEGO'], txt='CASI CUADRO POR CUADRO')
S(T(74, 0.6), 'grid', 'fecha', mes='VIDEO', dia='2017', anio='VIRAL', txt='EL VIDEO ORIGINAL')
S(T(75), 'mapa', 'mapa', foco='todo', titulo='NO SOLO UN MAPA', ttitulo=0.1)
S(T(76), 'anillos', 'telefono', variantes=['fiesta', 'pelea', 'caiman'], txt='UN ESPEJO DE TUS REDES')
S(T(77), 'tech', 'icono', icono='play', txt='TRÁILER 2')
S(T(77, 0.35), 'grid', 'fecha', mes='MAYO', dia='2025', anio='TRÁILER 2', txt='CUENTA NUEVA EN TIKTOK')
S(T(77, 0.62), 'rayos', 'contador', desde=0, hasta=1000000, txt='SEGUIDORES CON UN SOLO VIDEO', icono='seguir', dur=2.2)
# --- El precio
S(T(78), 'franjas', 'icono', icono='billetera', txt='EL BOLSILLO')
S(T(79), 'ciudad', 'precio', items=[dict(txt='$79.99', sub='ESTÁNDAR', t=0.2)])
S(T(80), 'tech', 'barras', barras=[dict(etiqueta='La mayoría', valor=69.99, prefijo='$', dec=2, t=0), dict(etiqueta='GTA 6', valor=79.99, prefijo='$', dec=2, t=0.4, color=A)], max=85, txt='+$10', ttxt=1.4)
S(T(81), 'grid', 'precio', items=[dict(txt='$79.99', sub='ESTÁNDAR', t=0), dict(txt='$99.99', sub='ULTIMATE', t=0.5, color=R)])
S(T(82), 'rayos', 'icono', icono='prohibido', txt='NO HABRÁ MÁS EDICIONES', paleta=ROJOS)
S(T(83), 'franjas', 'iconos', items=[dict(icono='trofeo', txt='ESPECIAL', t=0, tachado=0.5), dict(icono='caja', txt='COLECCIONISTA', t=0.35, tachado=0.9)])
S(T(84), 'circuitos', 'icono', icono='caja', txt='VERSIÓN FÍSICA')
S(T(84, 0.55), 'franjas', 'icono', icono='disco', txt='SIN DISCO', tachado=0.5)
S(T(85), 'tech', 'icono', icono='codigo', txt='SOLO UN CÓDIGO')
S(T(86), 'grid', 'descarga', icono='mando', txt='PRECARGA DESDE EL 12 NOV', dur=3.2)
S(T(87), 'ciudad', 'icono', icono='mando', txt='JUEGAS DESDE EL MINUTO 1')
# --- Lo que Rockstar esconde
S(T(88), 'circuitos', 'titulo', txt='LO QUE *ESCONDEN*', icono='candado')
S(T(89), 'rayos', 'icono', icono='ojo', txt='3 SECRETOS')
S(T(90), 'tech', 'titulo', txt='1 · LA *COMPUTADORA*', icono='pc')
S(T(91), 'grid', 'iconos', items=[dict(icono='consola', txt='PLAYSTATION 5', t=0.3), dict(icono='consola2', txt='XBOX SERIES', t=1.6)])
S(T(92), 'rayos', 'icono', icono='pc', txt='PC: NI UNA PALABRA', tachado=0.6, paleta=ROJOS)
S(T(93), 'grid', 'linea_tiempo', hitos=[dict(anio='2013', txt='GTA V CONSOLAS', t=0.3), dict(anio='2015', txt='GTA V EN PC', t=1.8), dict(anio='2018', txt='RDR 2 CONSOLAS', t=3.6), dict(anio='2019', txt='RDR 2 EN PC', t=5.0)])
S(T(94), 'anillos', 'titulo', txt='2 · MODO EN *LÍNEA*', icono='globo')
S(T(95), 'ciudad', 'icono', icono='dinero', txt='MÁQUINA DE HACER DINERO')
S(T(95, 0.5), 'tech', 'contador', desde=0, hasta=10, prefijo='+', sufijo=' AÑOS', txt='GTA ONLINE')
S(T(96), 'circuitos', 'iconos', items=[dict(icono='reloj', txt='¿CUÁNDO?', t=0.3), dict(icono='globo', txt='¿CÓMO?', t=1.6)])
S(T(97), 'anillos', 'icono', icono='silencio', txt='ESE SILENCIO DICE MUCHO')
S(T(98), 'rayos', 'titulo', txt='3 · EL *FINAL*', icono='lapida')
S(T(98, 0.45), 'grid', 'pareja', txt='¿CÓMO TERMINA?', medio='pregunta')
S(T(99), 'franjas', 'titulo', txt='*NADIE* LO SABE')
# --- Cierre
S(T(100), 'rayos', 'fecha', mes='NOV', dia=19, anio=2026, txt='EMPIEZA UNA NUEVA ERA', sello='YA LLEGA', tsello=2.0, colorSello=A)
S(T(101), 'tech', 'iconos', items=[dict(icono='candado', txt='SECRETOS', t=0), dict(icono='mando', txt='TRUCOS', t=0.9), dict(icono='pin', txt='LUGARES', t=2.0), dict(icono='libro', txt='HISTORIAS', t=3.2)])
S(T(101, 0.6), 'grid', 'titulo', txt='GTA 6 *EXPLICADO*', sub='CADA DÍA', tsub=0.8)
S(T(102), 'rayos', 'cierre', tclick=1.6)
S(T(103), 'circuitos', 'icono', icono='comentario', txt='DÉJAME TU RESPUESTA')
S(T(104), 'anillos', 'pareja', txt='¿JUNTOS O *TRAICIÓN*?', medio='pregunta')
S(T(105), 'grid', 'titulo', txt='NOS VEMOS EN EL *PRÓXIMO*', icono='mando')

# --- subtítulos: trozos cortos con palabra clave resaltada
CLAVE = set('''gta rockstar leonida vice city florida lucia caminos jason duval martillo secretos final importante mil millones dólares
callada filtró fecha serio loco neón palmeras estado turquesa caimanes mujer prisión caer traidor caras espejo código disco bolsillo
pc silencio nadie suscríbete campanita era juntos millón doscientos setenta noventa diez doce diecinueve diecisiete tiktok instagram
cayos grassrivers gellhorn ambrosia kalaga bonnie clyde cal hampton boobie ike priest dimez raul bautista brian heder ultimate
playstation xbox online traiciona dos mil trece veinticinco veintiséis veintitrés cinco seis tres youtube rotas aliado viral real
físico física computadora mayo noviembre diciembre septiembre secretos trucos'''.split())

def resaltar(txt):
    out = []
    for w in txt.split():
        core = re.sub(r'[^\wáéíóúñü\']', '', w.lower())
        out.append(f'*{w}*' if core in CLAVE else w)
    s = ' '.join(out)
    return s.replace('* *', ' ')

subs = []
for i, f in enumerate(fr):
    words = f['txt'].split(); chunks = []; cur = []
    for w in words:
        cur.append(w)
        L = len(' '.join(cur))
        if (L >= 22 and re.search(r'[,.:;?!]$', w)) or L >= 30:
            chunks.append(cur); cur = []
    if cur:
        if chunks and len(' '.join(cur)) < 10: chunks[-1] += cur
        else: chunks.append(cur)
    tot = sum(len(' '.join(c)) for c in chunks)
    t = f['ini']; dur = f['fin'] - f['ini']
    nxt = fr[i + 1]['ini'] if i + 1 < len(fr) else DUR
    for j, c in enumerate(chunks):
        d = dur * len(' '.join(c)) / tot
        fin = t + d if j < len(chunks) - 1 else min(nxt, f['fin'] + 0.35)
        subs.append(dict(ini=round(t, 2), fin=round(fin, 2), txt=resaltar(' '.join(c))))
        t += d

P.sort(key=lambda e: e['inicio'])
json.dump(dict(serie='gta', titulo='GTA 6: Lo que NADIE te ha contado antes del lanzamiento', duracion=DUR, escenas=P, subs=subs),
          open(os.path.join(AQUI, 'escenas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(P), 'escenas,', len(subs), 'subtítulos')
