# Así Pasó Explicado — producción de videos

Repositorio de medios y producción para @asipasoexplicado (Instagram, Facebook, TikTok, YouTube).
Victor sube los audios de ElevenLabs; Claude produce, corta, sube y programa sin pedir aprobación
(títulos, descripciones, etiquetas y programación incluidos).

## Regla principal: no pedirle a Victor que haga nada
Victor solo entrega el audio. Todo lo demás lo hace Claude de punta a punta: render, subida a YouTube
(vía Metricool, que tiene el canal conectado), cortes para redes, programación, y ocultar o borrar
videos viejos. Si una herramienta falla (créditos de vidIQ, límites de tamaño, etc.), buscar otra vía
(Metricool, navegador, GitHub) y resolverlo. Al final solo se le informa qué quedó hecho.
Para subir por Metricool el video debe estar en un enlace público de menos de 100 MB
(raw.githubusercontent.com de este repo); comprimir con 2 pasadas si hace falta.

## Series (diarias, sin pausa)
| Serie | Hora (RD, UTC-4) | Palabra ManyChat | Carpeta |
|---|---|---|---|
| Historia de RD | 07:00 | Historia | `historia/` |
| Biblia | 12:00 | Biblia | `biblia/` |
| Salud | 17:00 | Cuerpo | `salud/` |
| Nutrición | 22:00 | Nutrición | `nutricion/` |

## Estructura
```
templates/<serie>/      plantilla de animación de cada serie (se hace una vez y se reutiliza)
<serie>/<episodio>/
  guion.txt             guion final (el mismo que se pegó en ElevenLabs)
  audio.mp3             audio de Victor
  escenas.json          escenas con tiempos, sacadas del audio
  largo_youtube.mp4     horizontal 16:9, sin laterales
  capitulos/            reels verticales 9:16 cortados del largo
```

## Flujo por episodio
1. Leer `guion.txt` y `audio.mp3`; marcar los tiempos de cada frase y armar `escenas.json`.
2. Renderizar el largo con la plantilla de la serie → `largo_youtube.mp4`. Se sube a YouTube PRIMERO.
3. Cortar en capítulos verticales de 1:50 a 2:30 → `capitulos/`.
4. Cada capítulo de redes cierra con "comenta la palabra <palabra>". Nunca mencionar YouTube ni el perfil.
   La versión de YouTube lleva un cierre distinto.
5. Subir al repo y programar en Metricool a la hora de la serie, un capítulo por día.

## Reglas de animación (obligatorias)
- Nada de texto quieto. El texto en pantalla es corto y entra y sale al ritmo de la voz.
- Cambio visual cada 3 a 5 segundos: retratos ilustrados en movimiento (bustos estilizados, nunca fotos),
  mapas que se trazan, escenas que se construyen, líneas de tiempo, transiciones.
- La historia se cuenta con imágenes y las escenas enlazan entre sí (continuidad).
- Lo más llamativo va en los primeros segundos (de ahí sale la portada; no se sube portada aparte).
- Cada serie tiene paleta y estilo propios; Biblia = papiro antiguo. No mezclar estilos.
- Biblia: el versículo aparece escrito en pantalla mientras se lee (Reina-Valera 1960).
- A mitad del video, el aviso de compartir y seguir.

## Para ahorrar
- No reescribir la animación por episodio: solo cambiar los datos en `escenas.json` y usar la plantilla.
- Una sesión por semana: renderizar los largos de las 4 series, cortar y programar toda la semana.
