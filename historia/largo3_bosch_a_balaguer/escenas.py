SERIE = 'historia'; TITULO = 'De Bosch a Balaguer (1961–1978)'; PALABRA = 'Historia'
PROXIMO = 'Los gobiernos después de 1978'
COMPARTIR = 55; CAPITULOS = [0, 21, 38, 56, 75, 92]
PERSONAJES = {
 'trujillo': {'nombre': 'Trujillo', 'etiqueta': 'Rafael L. Trujillo', 'piel': '#C48E65', 'pelo': 'corto', 'colorPelo': '#1F1712', 'bigote': 'grueso', 'ropa': 'militar', 'banda': True, 'medallas': True, 'cejas': 'fruncidas'},
 'ramfis': {'nombre': 'Ramfis Trujillo', 'etiqueta': 'Ramfis Trujillo', 'piel': '#C99367', 'pelo': 'corto', 'colorPelo': '#1A1410', 'bigote': 'grueso', 'ropa': 'militar', 'colorRopa': '#5B6B45', 'lentes': True, 'cejas': 'fruncidas', 'mirada': -0.3},
 'balaguer': {'nombre': 'Joaquín Balaguer', 'etiqueta': 'Joaquín Balaguer', 'piel': '#D8A47A', 'pelo': 'corto', 'colorPelo': '#2A1D14', 'lentes': True, 'ropa': 'levita', 'mirada': 0.2},
 'balaguer_mayor': {'nombre': 'Joaquín Balaguer', 'etiqueta': 'Joaquín Balaguer', 'piel': '#D8A47A', 'pelo': 'calvo', 'colorPelo': '#9A9086', 'lentes': True, 'ropa': 'levita', 'edad': 'mayor', 'mirada': -0.2},
 'bosch': {'nombre': 'Juan Bosch', 'etiqueta': 'Juan Bosch', 'piel': '#E0B08A', 'pelo': 'corto', 'colorPelo': '#E6E1D8', 'ropa': 'levita', 'colorRopa': '#3A3F4A', 'mirada': 0.3},
 'manolo': {'nombre': 'Manolo Tavárez Justo', 'etiqueta': 'Manolo Tavárez Justo', 'piel': '#D4A07A', 'pelo': 'corto', 'colorPelo': '#1F1712', 'bigote': 'grueso', 'ropa': 'camisa', 'colorRopa': '#7C8A5A'},
 'manolo_guerrilla': {'nombre': 'Manolo Tavárez Justo', 'etiqueta': 'Manolo · 14 de Junio', 'piel': '#D4A07A', 'pelo': 'corto', 'colorPelo': '#1F1712', 'bigote': 'grueso', 'barba': 'corta', 'ropa': 'militar', 'colorRopa': '#5B6B45', 'sombrero': 'kepis', 'colorSombrero': '#5B6B45'},
 'minerva': {'nombre': 'Minerva Mirabal', 'etiqueta': 'Minerva Mirabal', 'mujer': True, 'piel': '#D29A72', 'pelo': 'largo', 'colorPelo': '#1D1612', 'ropa': 'vestido', 'colorRopa': '#2F5D8A', 'mirada': 0.3},
 'triunviro': {'nombre': 'El Triunvirato', 'etiqueta': 'El Triunvirato', 'piel': '#E0B08A', 'pelo': 'corto', 'colorPelo': '#2A1D14', 'bigote': 'grueso', 'lentes': True, 'ropa': 'levita', 'colorRopa': '#2B2B3A', 'cejas': 'fruncidas'},
 'general': {'nombre': 'San Isidro', 'etiqueta': 'Los militares de San Isidro', 'piel': '#C48E65', 'pelo': 'corto', 'colorPelo': '#1A1410', 'bigote': 'grueso', 'ropa': 'militar', 'colorRopa': '#4A5A3A', 'sombrero': 'kepis', 'colorSombrero': '#4A5A3A', 'medallas': True, 'cejas': 'fruncidas', 'mirada': -0.4},
 'caamano': {'nombre': 'Francisco Caamaño', 'etiqueta': 'Coronel Francisco A. Caamaño Deñó', 'piel': '#C99367', 'pelo': 'corto', 'colorPelo': '#1A1410', 'bigote': 'grueso', 'ropa': 'militar', 'colorRopa': '#6B7A4A', 'cejas': 'fruncidas', 'mirada': 0.3},
 'johnson': {'nombre': 'Lyndon Johnson', 'etiqueta': 'Lyndon B. Johnson · EE. UU.', 'piel': '#F0C7A4', 'pelo': 'corto', 'colorPelo': '#B9B2A6', 'ropa': 'levita', 'colorRopa': '#2B3A55', 'edad': 'mayor', 'mirada': -0.3},
 'marine': {'nombre': 'Marine', 'etiqueta': 'Marines de EE. UU.', 'piel': '#F0C7A4', 'pelo': 'corto', 'colorPelo': '#B9A48A', 'ropa': 'militar', 'colorRopa': '#6B6B45', 'sombrero': 'kepis', 'colorSombrero': '#6B6B45'},
 'guzman': {'nombre': 'Antonio Guzmán', 'etiqueta': 'Antonio Guzmán', 'piel': '#D8A47A', 'pelo': 'corto', 'colorPelo': '#CFC8BD', 'ropa': 'levita', 'colorRopa': '#3A3F4A', 'lentes': True, 'edad': 'mayor', 'mirada': 0.3},
 'campesino': {'nombre': 'Campesino', 'etiqueta': '', 'piel': '#8E5A3A', 'pelo': 'corto', 'colorPelo': '#1A1410', 'bigote': 'grueso', 'ropa': 'camisa', 'colorRopa': '#C9B48A', 'sombrero': 'sombrero'},
}
f = lambda x: 'f%s' % x
def tx(*xs): return [(f(k), s) for k, s in xs]
def li(*xs): return [{'icono': i, 'txt': s, 't': f(k)} for i, s, k in xs]
def R(p, *t, p2=None, t2=None, et=None):
    e = {'tipo': 'retrato', 'personaje': p, 'texto': tx(*t)}
    if p2: e['personaje2'] = p2; e['t2'] = f(t2)
    if et: e['etiqueta'] = et
    return e
def LT(*h, t=()): return {'tipo': 'linea_tiempo', 'hitos': [{'anio': a, 'txt': s, 't': f(k)} for a, s, k in h], 'texto': tx(*t)}
def MAP(pts, t=(), ruta=None, enf=None):
    e = {'tipo': 'mapa', 'region': 'hispaniola', 'puntos': [dict(({'nombre': n} if isinstance(n, str) else {'lugar': n}), t=f(k), **({'etiqueta': et} if et else {}), **({'lado': x[0]} if x else {})) for n, k, et, *x in pts], 'texto': tx(*t)}
    if ruta: e['ruta'] = {'de': ruta[0], 'a': ruta[1], 't': f(ruta[2]), 'dur': 2.2}
    if enf: e['enfoques'] = [{'lugar': enf[0], 'escala': enf[1], 't': f(enf[2])}]
    return e
NOCHE = {'cielo': ['#0B1430', '#24345E'], 'sol': '#E8E4D0', 'nube': '#2E3B60', 'lejos': '#18223F', 'tierra': '#2A2018', 'hojas': '#1D3A28'}
GRIS = {'cielo': ['#1B2233', '#4A5468'], 'sol': '#9AA5B8', 'nube': '#5B6578', 'lejos': '#2A3245'}
def ESC(preset, *t, sem=1, col=None):
    e = {'tipo': 'escenario', 'preset': preset, 'semilla': sem, 'texto': tx(*t)}
    if col: e['colores'] = col
    return e
SD = 'Santo Domingo'; SI = [-69.67, 18.50]; MANACLAS = [-71.05, 19.22]; CARACOLES = [-70.55, 18.30]
E = [
 (0, {'tipo': 'cifra', 'desde': 0, 'hasta': 31, 'sufijo': ' años', 'texto': tx((0, 'Esperando para *votar libres*'))}),
 (1, R('bosch', (1, 'Y el presidente que eligieron'), (1.55, 'duró *siete meses*'))),
 (2, {'tipo': 'lista', 'texto': tx((2, 'Lo que vino *después*'),), 'items': li(('alerta', 'Un golpe de Estado', 2.25), ('fuego', 'Una guerrilla en las montañas', 2.45), ('espada', 'Una guerra en las calles', 2.65), ('escudo', '40,000 soldados extranjeros', 2.85))}),
 (3, R('trujillo', (3, '30 de mayo de *1961*'), (4, 'Pero la dictadura *no se fue* con él'))),
 (5, R('ramfis', (5, 'Ramfis vuelve de Europa'), (5.5, 'y toma el *ejército*'))),
 (6, ESC('pueblo', (6, 'Los del ajusticiamiento: *perseguidos*'), (6.55, 'casi todos terminaron *muertos*'), sem=12, col=NOCHE)),
 (7, R('balaguer', (7, 'Balaguer seguía en el *Palacio*'))),
 (8, ESC('puerto', (8, 'Noviembre de *1961*'), (8.5, 'los Trujillo se van *para siempre*'), sem=8)),
 (9, ESC('puerto', (9, 'Empiezan a *regresar*'), (10, 'un escritor de cuentos'), sem=3)),
 (11, R('bosch', (11, '*Juan Bosch*'), (12, 'Sin dinero ni *ejército*'))),
 (13, {'tipo': 'lista', 'items': li(('libro', 'Una radio', 13.2), ('comentario', 'Una forma de hablar nueva', 13.55)), 'texto': tx((13, 'Tenía otra cosa'))}),
 (14, R('campesino', (14, 'Le hablaba al campesino *como campesino*'), (15, 'le explicaba *por qué era pobre*'))),
 (16, MAP([('Santiago', 16.2, None), ('La Vega', 16.35, None), ('San Juan', 16.5, None), ('Higüey', 16.65, None), ('Barahona', 16.8, None)], t=((16, 'Pueblo por pueblo con el *PRD*'),))),
 (17, ESC('pueblo', (17, '20 de diciembre de *1962*'), (17.5, 'primeras elecciones libres en *30 años*'), sem=7)),
 (18, {'tipo': 'comparar', 'max': 100, 'barras': [{'etiqueta': 'Bosch', 'valor': 60, 'sufijo': '%', 't': f(18.2)}, {'etiqueta': 'Los demás', 'valor': 40, 'sufijo': '%', 't': f(18.5)}], 'texto': tx((18, 'Casi *6 de cada 10* votos'))}),
 (19, R('bosch', (19, '27 de febrero de *1963*'), (19.5, 'se jura *presidente*'))),
 (20, ESC('pueblo', (20, 'La noche de Trujillo'), (20.5, 'por fin había *terminado*'), sem=4)),
 (21, R('bosch', (21, 'Bosch empezó *rápido*'))),
 (22, LT(('1963', 'Nueva Constitución', 22.3), t=((22, 'Abril de *1963*'), (22.55, 'de las más *avanzadas* de América Latina')))),
 (23, {'tipo': 'lista', 'items': li(('comentario', 'Libertad de expresión', 23.1), ('escudo', 'Derechos de los trabajadores', 23.4), ('alerta', 'Límites a los grandes terrenos', 23.7))}),
 (24, R('bosch', (24, 'No persiguió a nadie *por sus ideas*'), (25, 'Y ahí empezó su *problema*'))),
 (26, R('general', (26, 'Militares, terratenientes'), (26.5, 'lo acusan de *comunista*'))),
 (27, LT(('1959', 'Revolución cubana', 27.2), ('1963', 'Esa palabra tumba gobiernos', 27.6))),
 (28, ESC('ciudad_antigua', (28, 'Los periódicos *atacan*'), (29, 'En los cuarteles se *conspira*'), sem=6, col=GRIS)),
 (30, R('bosch', (30, 'Lo sabía'), (30.45, 'y no usó *la fuerza*'))),
 (31, ESC('pueblo', (31, '25 de septiembre de *1963*'), (31.5, 'militares entran al *Palacio*'), sem=12, col=NOCHE)),
 (32, ESC('puerto', (32, 'En un barco, al *exilio*'), (33, 'Gobernó *siete meses*'), sem=5, col=GRIS)),
 (34, R('triunviro', (34, 'Tres civiles escogidos por los militares'), (34.6, 'el *Triunvirato*'))),
 (35, {'tipo': 'comparar', 'max': 31, 'barras': [{'etiqueta': 'Dictadura', 'valor': 31, 'sufijo': ' años', 't': f(35.2)}, {'etiqueta': 'Democracia', 'valor': 0.6, 'sufijo': ' años', 't': f(35.5)}], 'texto': tx((35, 'Duró *menos que un embarazo*'))}),
 (36, MAP([('Monte Cristi', 37.1, None)], t=((36, 'No todos *aceptaron*'), (37, 'Un abogado de *Montecristi*')), enf=('Monte Cristi', 1.9, 37.3))),
 (38, R('manolo', (38, '*Manolo Tavárez Justo*'))),
 (39, LT(('1959', 'Nace el 14 de Junio', 39.2), t=((39, 'Líder del *14 de Junio*'),))),
 (40, R('minerva', (40, 'El viudo de *Minerva Mirabal*'), (41, 'asesinada *tres años antes*'))),
 (42, R('manolo', (42, 'Sale de la *cárcel*'), (42.5, 'uno de los hombres *más queridos*'))),
 (43, R('manolo', (43, 'Cuando tumban a Bosch'), (43.5, 'si se cierran los caminos *de la democracia*'), (43.8, 'el pueblo puede *tomar las armas*'))),
 (44, MAP([(MANACLAS, 44.3, 'Cordillera Central'), ('San Juan', 44.5, None), ('Santiago', 44.65, None)], t=((44, '28 de noviembre de *1963*'), (44.5, 'suben a *las montañas*')))),
 (45, ESC('campo', (45, 'Estudiantes y *profesionales*'), (46, 'Lluvia, hambre y *el ejército*'), sem=21, col=NOCHE)),
 (47, MAP([(MANACLAS, 47.4, 'Las Manaclas')], t=((47, 'Finales de diciembre'), (47.5, 'agotados en *Las Manaclas*')), enf=(MANACLAS, 2.4, 47.5))),
 (48, R('manolo_guerrilla', (48, 'Aceptaron *rendirse*'), (48.55, 'con la promesa de *respetar sus vidas*'))),
 (49, ESC('campo', (49, '21 de diciembre de *1963*'), (49.55, 'Manolo y 14 compañeros: *fusilados*'), sem=30, col=NOCHE)),
 (50, R('manolo', (50, 'Tenía *32 años*'), (51, 'El país, en *shock*'))),
 (52, R('minerva', (52, 'Las tres hermanas'), (52.5, 'y ahora el esposo de *Minerva*'))),
 (53, R('triunviro', (53, 'El Triunvirato *no iba a durar*'), (54, 'militares que querían a *Bosch* de vuelta'))),
 (55, {'tipo': 'lista', 'items': li(('compartir', 'Comparte', 55.2), ('corazon', 'Síguenos', 55.5))}),
 (56, ESC('ciudad_antigua', (56, '24 de abril de *1965*'), (56.5, 'oficiales jóvenes se *levantan*'), sem=9)),
 (57, LT(('1963', 'La Constitución', 57.3), ('1965', 'Que vuelva Bosch', 57.7), t=((57, 'Querían *una sola cosa*'),))),
 (58, R('caamano', (58, 'Los *constitucionalistas*'))),
 (59, ESC('ciudad_antigua', (59, 'La noticia por la *radio*'), (59.5, 'el pueblo a las *calles*'), (60, 'armas para los *civiles*'), sem=10)),
 (61, R('triunviro', (61, 'En pocas horas'), (61.5, 'el Triunvirato *se cae*'))),
 (62, R('general', (62, 'Pero en *San Isidro*'), (62.5, 'no querían a Bosch'))),
 (63, MAP([(SD, 63.3, 'La capital', -1), (SI, 65, 'San Isidro', 1)], t=((63, 'El país *se parte en dos*'),), enf=(SD, 2.3, 63.5))),
 (66, ESC('ciudad_antigua', (66, 'Los aviones *bombardean*'), sem=14, col=GRIS)),
 (67, MAP([(SI, 67.2, 'San Isidro', 1), (SD, 67.5, 'Puente Duarte', -1)], t=((67, '27 de abril: el *puente Duarte*'),), ruta=(SI, SD, 67.3), enf=(SD, 2.6, 67.6))),
 (68, ESC('ciudad_antigua', (68, 'Fusiles, botellas'), (68.5, 'los civiles los *detienen*'), sem=15)),
 (69, R('caamano', (69, 'Un coronel de *32 años*'), (70, '*Francisco Alberto Caamaño Deñó*'))),
 (71, R('caamano', (71, 'Hijo de un general de *Trujillo*'), (72, 'convertido en *símbolo*'), p2='trujillo', t2=71.1)),
 (73, R('caamano', (73, 'A punto de *ganar*'), (74, 'Pero desde el mar…'))),
 (75, R('johnson', (75, '28 de abril de *1965*'), (75.5, 'Johnson manda a los *marines*'))),
 (76, R('johnson', (76, 'Oficial: proteger a sus ciudadanos'), (77, 'Real: evitar *otra Cuba*'))),
 (78, LT(('1916', 'Primera ocupación', 78.2), ('1965', 'Vuelven los marines', 78.6))),
 (79, {'tipo': 'cifra', 'desde': 0, 'hasta': 40000, 'prefijo': '+', 'miles': True, 'texto': tx((79, 'soldados *extranjeros*'),)}),
 (80, MAP([(SD, 80.3, 'Ciudad Colonial')], t=((80, 'Rodean la *Ciudad Colonial*'),), enf=(SD, 3.0, 80.4))),
 (81, R('caamano', (81, 'Presidente *constitucional*'), (81.5, 'de unas cuantas *cuadras*'))),
 (82, ESC('ciudad_antigua', (82, 'Un corredor militar'), (83, 'el pueblo *armado*'), (84, 'contra los *norteamericanos*'), sem=16, col=GRIS)),
 (85, ESC('ciudad_antigua', (85, 'Murieron *miles*'), (85.5, 'la mayoría *civiles*'), sem=17, col=NOCHE)),
 (86, R('marine', (86, 'La OEA manda *tropas de otros países*'), (86.6, 'otra cara para la *ocupación*'))),
 (87, {'tipo': 'lista', 'items': li(('x', 'Sin forma de ganar', 87.2), ('libro', 'Firman un acuerdo', 87.6))}),
 (88, LT(('1965', 'Gobierno provisional', 88.3), ('1966', 'Elecciones', 88.7))),
 (89, R('caamano', (89, 'Caamaño entrega el mando'), (89.5, 'enviado a *Londres*'))),
 (90, R('bosch', (90, 'Bosch vuelve como *candidato*'), (91, 'Y del otro lado…'))),
 (92, R('balaguer', (92, '1 de junio de *1966*'), (92.5, 'gana *Balaguer*'))),
 (93, R('bosch', (93, 'Bosch casi no hizo campaña'), (93.5, 'por *miedo a que lo mataran*'))),
 (94, R('balaguer', (94, 'El presidente de Trujillo'), (94.5, '*vuelve al poder*'), (95, 'Y no lo *soltó*'))),
 (96, LT(('1966', 'Gana', 96.1), ('1970', 'Gana otra vez', 96.35), ('1974', 'Y otra vez', 96.7))),
 (97, {'tipo': 'cifra', 'desde': 0, 'hasta': 12, 'sufijo': ' años', 'texto': tx((97, 'Los *doce años*'),)}),
 (98, {'tipo': 'lista', 'items': li(('check', 'Carreteras', 98.2), ('check', 'Presas', 98.4), ('check', 'Viviendas', 98.6))}),
 (99, ESC('pueblo', (99, 'Pero también: *años de miedo*'), (100, 'perseguidos, asesinados, *desaparecidos*'), sem=18, col=NOCHE)),
 (101, MAP([(CARACOLES, 101.5, 'Playa Caracoles')], t=((101, 'Febrero de *1973*'), (101.35, 'Caamaño vuelve *en secreto*'), (101.7, 'por *Playa Caracoles*')), enf=(CARACOLES, 2.4, 101.6))),
 (102, R('caamano', (102, 'Repetir la revolución'), (102.5, 'desde *las montañas*'))),
 (103, ESC('campo', (103, '16 de febrero'), (103.5, 'capturado *y asesinado*'), (104, 'Tenía *40 años*'), sem=31, col=NOCHE)),
 (105, R('guzman', (105, 'Mayo de *1978*'), (105.5, 'elecciones otra vez'))),
 (106, R('balaguer_mayor', (106, 'Balaguer va *perdiendo*'), (106.5, 'soldados *detienen el conteo*'), p2='guzman', t2=106.2)),
 (107, R('balaguer_mayor', (107, 'Presión dentro y fuera'), (108, 'Balaguer termina *aceptando*'))),
 (109, LT(('1978', '16 de agosto', 109.2), t=((109.3, 'Primera vez: el poder *en paz*'), (109.65, 'a un *opositor elegido*')))),
 (110, R('guzman', (110, 'La democracia *para quedarse*'), (111, 'pero vendrían *nuevas tragedias*'))),
]
