# Hypnos Prime — Demo PWA

Una experiencia tipo Spotify, pero para hipnosis y reprogramación subconsciente.
Construido a partir de los wireframes generados en Google Stitch (carpeta
[`stitch_hypnos_prime_pwa/`](./stitch_hypnos_prime_pwa)).

## Stack
- HTML estático + Tailwind CDN + JavaScript vanilla (sin build step)
- Web Audio API → genera **binaural beats reales** + pads ambientales
- Service Worker → offline / instalable
- Vercel: despliega `index.html` con rewrites SPA

## Estructura
```
index.html              ← entrada principal (todas las vistas)
manifest.webmanifest    ← metadatos PWA
sw.js                   ← service worker (cache + offline)
vercel.json             ← rewrites + headers (arregla los 404)
assets/
  css/styles.css        ← tema "Mystic Gilded Minimalism"
  js/app.js             ← router + estado + render de vistas
  js/player.js          ← motor de audio generativo
  icons/                ← logo + chakras + iconos PWA
stitch_hypnos_prime_pwa/← plantillas originales de Stitch (referencia)
```

## Vistas
- **Welcome** — splash de marca con CTA dorado
- **Inicio (Home)** — sesión destacada, categorías chakra, recomendados, continuar
- **Biblioteca** — filtros (todas / chakra / favoritos), lista de sesiones
- **Explorar** — buscador + sugerencias + grid por chakra
- **Reproductor inmersivo** — artwork respirando, controles, progreso, volumen,
  fav, share, navegación entre sesiones, info de frecuencia binaural (Hz / banda)
- **Ajustes** — perfil demo, haptics, wake-lock, modo enfoque, instalar PWA
- **Mini-player** — barra dockeada que sigue al usuario al navegar

## Cómo se ve / suena
Cada sesión define un **carrier** (Hz) + **beat** (diferencia para el binaural),
por ejemplo:
- *Sueño Profundo* → 96 Hz / 2.5 Hz (delta)
- *Reprogramación Subconsciente* → 110 Hz / 4.5 Hz (theta)
- *Enfoque Total* → 200 Hz / 14 Hz (beta)
- *Transformación Radical* → 256 Hz / 10 Hz (alpha)

> Usa **audífonos** para que el binaural beat se perciba. El reproductor
> también incluye un pad armónico con LFO de afinación + ruido rosa filtrado
> para crear un colchón ambiental.

## Desarrollo local
No requiere build. Cualquier servidor estático funciona:
```bash
python3 -m http.server 5500
# → http://localhost:5500
```

## Despliegue
Push a la rama → Vercel construye automáticamente. El `vercel.json` se encarga
de los rewrites para que cualquier ruta (`/home`, `/player/...`) sirva
`index.html` y la SPA tome control.
