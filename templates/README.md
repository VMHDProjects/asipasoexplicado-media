# Plantillas de animación

Una plantilla por serie, sobre un motor común. No se reescribe la animación por episodio: solo se arma `escenas.json` con los tiempos del audio y se renderiza.

```
templates/
  _motor/        motor común (core.js, escenas.js, personajes.js, mapas.js, escenarios.js, render.py, fuentes/)
  historia/      tema.js  · azul tinta, carmesí, crema de archivo · medallones · corte diagonal rojo
  biblia/        tema.js  · papiro antiguo, tinta sepia, rúbrica roja · versículo escrito a pluma · borde quemado
  salud/         tema.js  · verde azulado, coral, menta · cuerpo con órganos que se iluminan · transición circular
  nutricion/     tema.js  · verde bosque, mandarina · alimentos que caen y rebotan, plato por porciones · persianas
  <serie>/ejemplo/escenas.json   ejemplo listo para probar
```

## Renderizar

```bash
# YouTube 16:9 (sale largo_youtube.mp4 junto al escenas.json; mezcla audio.mp3 si está ahí)
python3 templates/_motor/render.py historia/<episodio>/escenas.json --formato youtube

# Redes 9:16, un capítulo del largo
python3 templates/_motor/render.py historia/<episodio>/escenas.json --formato redes --desde 0 --hasta 140 --salida capitulos/01.mp4

# Solo cuadros de muestra para revisar
python3 templates/_motor/render.py historia/<episodio>/escenas.json --en 3,30,90
```

Al iniciar avisa si hay tramos de más de 5 s sin cambio visual. Velocidad aproximada: 4–5 s de render por cada segundo de video con 2 núcleos.

## escenas.json

```json
{
  "serie": "historia",
  "duracion": 642.6,
  "personajes": { "lilis": { "nombre": "Ulises Heureaux", "etiqueta": "Ulises Heureaux · Lilís", "piel": "#5A3826", "pelo": "rizado", "bigote": "grueso", "ropa": "militar", "banda": true } },
  "escenas": [
    { "tipo": "retrato", "personaje": "lilis", "inicio": 11.6, "fin": 15.6,
      "texto": [ { "t": 0.1, "txt": "Lo que vino después fue *peor*" }, { "t": 2.6, "txt": "Un dictador que lo *sabía todo*" } ] }
  ],
  "superpuestos": [ { "tipo": "compartir", "inicio": 318, "fin": 323 } ]
}
```

- `inicio` / `fin`: segundos del audio. `texto[].t`: segundos desde el inicio de la escena. `*palabra*` = resaltado.
- Cada frase en pantalla entra palabra por palabra, crece despacio mientras suena y sale antes de la siguiente.
- El cierre cambia solo según el formato: redes = "Comenta la palabra ___"; YouTube = suscripción + próximo episodio.

### Tipos de escena

| tipo | para qué | campos |
|---|---|---|
| `titular` | frase grande | `fondo` (texto gigante de fondo) |
| `retrato` | personaje ilustrado | `personaje`, `personaje2` + `t2` (dos a la vez), `etiqueta` |
| `mapa` | mapa que se traza | `region` (`hispaniola`, `levante`), `puntos[{nombre\|lugar,t,etiqueta,lado}]`, `ruta{de,a,t,dur}`, `enfoque(s){lugar,t,escala}` |
| `linea_tiempo` | años que se cuentan | `hitos[{anio,txt,t}]` |
| `escenario` | escena que se construye | `preset` (`pueblo`, `campo`, `puerto`, `desierto`, `ciudad_antigua`), `semilla`, `colores` |
| `cifra` | número que cuenta | `desde`, `hasta`, `prefijo`, `sufijo`, `miles` |
| `lista` | ideas con íconos | `items[{icono,txt,t}]` |
| `comparar` | barras | `barras[{etiqueta,valor,sufijo,icono,t}]`, `max` |
| `cierre` | final | `palabra`, `proximo`, `titulo` |
| `versiculo` (Biblia) | versículo escrito a pluma en un rollo | `cita`, `versiculo`, `version` |
| `genealogia` (Biblia) | cadena de nombres | `nombres[{nombre,anos,final,resaltar,t}]` |
| `arca`, `tronos` (Biblia) | objetos ilustrados | `desaparece`, `tTronos`, `tCoronas` |
| `cuerpo` (Salud) | cuerpo con órganos | `organos[{id,t,etiqueta}]` (cerebro, ojos, tiroides, pulmones, corazon, higado, estomago, rinones, intestino, pancreas, vejiga) |
| `alimentos` (Nutrición) | alimentos con sello sí/no | `alimentos[{alimento,marca,etiqueta,t}]` |
| `plato` (Nutrición) | plato por porciones | `porciones[{parte,alimento,etiqueta,t}]` |

Personajes: `piel`, `pelo` (corto, rizado, calvo, largo, recogido), `colorPelo`, `bigote` (grueso, manubrio), `barba` (corta, larga, perilla), `ropa` (militar, levita, tunica, bata, camisa, vestido), `colorRopa`, `colorManto`, `sombrero` (bicornio, kepis, sombrero, corona, manto, turbante), `banda`, `medallas`, `lentes`, `mujer`, `edad: "mayor"`, `cejas: "fruncidas"`, `mirada` (−1 a 1).
