# JasyTECH

Sitio institucional en español construido con React y Vite.

- Sitio: https://jasytech.github.io/jasyweb/
- Organización: https://github.com/jasytech
- Contacto: jasytech.arg@gmail.com

## Desarrollo

Usar Node.js 24 (ver `.nvmrc`) y npm.

```bash
nvm use
npm ci
npm run dev
```

Abrir la dirección que muestra Vite, con la ruta `/jasyweb/`.

## Compilación y pruebas

```bash
npx playwright install chromium
npm run check
```

`check` verifica el formato, genera la versión de producción y ejecuta las pruebas de navegador. Las pruebas del formulario interceptan las solicitudes: no envían correos reales.

Si ya hay un Chrome instalado, se puede usar sin descargar Chromium:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome npm run check
```

Otros comandos:

- `npm run format`: aplica Prettier.
- `npm run build`: compila y prerenderiza el contenido en `dist/`.
- `npm run preview`: sirve la compilación de producción localmente.
- `npm test`: prueba una compilación ya generada.

La plantilla `docs/github-actions-ci.yml.example` permite ejecutar las verificaciones en GitHub Actions. Para activarla, copiarla a `.github/workflows/ci.yml` y subirla con una credencial que tenga permiso `workflow`. La credencial disponible durante esta actualización no tiene ese permiso; por eso las verificaciones se ejecutaron localmente y el workflow no está activo.

## Contacto: activación necesaria

El formulario conserva los campos originales y envía un POST a [FormSubmit](https://formsubmit.co/) desde la página. No requiere abrir una aplicación de correo ni colocar contraseñas en el código.

El endpoint de `src/config.js` usa el identificador público proporcionado por FormSubmit en lugar del email. El correo de la empresa sigue visible como contacto alternativo. Reemplazar el endpoint no sustituye la confirmación mediante «Activate Form» en el correo recibido.

Para habilitar la entrega a la empresa:

1. Publicar el sitio y completar un envío desde el formulario.
2. Revisar `jasytech.arg@gmail.com`, incluida la carpeta de spam.
3. Abrir el correo de FormSubmit y confirmar la activación.
4. Hacer otro envío y comprobar que llega con nombre, email y mensaje; verificar también que se puede responder al remitente.

La activación y la recepción real requieren acceso a esa casilla. Un build exitoso o las pruebas automáticas no verifican la entrega de correos. FormSubmit es un servicio externo; sus condiciones y disponibilidad determinan la entrega.

La interfaz bloquea envíos duplicados, valida campos, limita la espera a 20 segundos y conserva los datos ante errores o activación pendiente detectada. Solo muestra éxito cuando el servicio responde que aceptó el mensaje. Eso no prueba que Gmail lo haya entregado a la bandeja de entrada. No reintenta automáticamente para evitar mensajes duplicados si el servidor recibió una solicitud pero la respuesta se perdió.

Cada consulta nueva usa un asunto con el nombre, fecha y hora de Argentina y un identificador único, para que Gmail no agrupe distintos envíos bajo el mismo asunto. Esto aplica a los mensajes futuros; no cambia los correos ya recibidos.

## Fondo y desplazamiento

La imagen de marca está en una única capa fija detrás de toda la página. El contenido se desplaza por encima, con fondos translúcidos para conservar la legibilidad. El hero tiene altura según su contenido, sin los mínimos anteriores de 690/650 píxeles. La capa decorativa no captura clics ni aparece en lectores de pantalla.

Documentación: [AJAX](https://formsubmit.co/ajax-documentation), [activación y problemas frecuentes](https://formsubmit.co/help).

## Despliegue

```bash
npm run deploy
```

El comando ejecuta primero todas las verificaciones y después publica `dist/` en la rama `gh-pages`. Hace falta acceso de escritura al repositorio y un navegador de Playwright instalado. Para usar Chrome del sistema, se puede anteponer la misma variable mostrada arriba.

GitHub Pages debe publicar desde `gh-pages`, carpeta raíz. La rama `main` contiene las fuentes; `dist/` no se versiona. La publicación no es automática al hacer push a `main`: ejecutar `npm run deploy` después de verificar los cambios.

Si cambia el dominio o la ruta, actualizar `base` en `vite.config.js`, `homepage` en `package.json`, las URLs de `index.html`, `public/sitemap.xml` y `_url` del formulario. No publicar un `robots.txt` de proyecto suponiendo que controla todo `jasytech.github.io`: los robots consultan ese archivo en la raíz del dominio.

## Organización

- `src/App.jsx`: secciones de presentación, servicios y proceso.
- `src/components/`: encabezado, marca, hero, soluciones, contacto y pie.
- `src/config.js`: email, GitHub y rutas compartidas.
- `src/styles.css`: estilos, adaptación a pantallas y accesibilidad.
- `public/assets/`: imágenes optimizadas que se publican.
- `branding/`: imágenes PNG originales, conservadas fuera de la publicación.
- `scripts/prerender.mjs`: genera HTML con el mismo contenido React, que luego se hidrata en el navegador.
- `tests/site.spec.js`: pruebas de formulario, navegación, recursos y tamaños de pantalla.

Las tarjetas de soluciones son ejemplos, no trabajos realizados ni clientes. Reemplazarlas por un portfolio solo cuando existan proyectos reales y contenido autorizado.

Google Fonts provee Manrope y DM Mono; existen fuentes de respaldo si no está disponible. No hay base de datos, cuentas de usuario ni claves privadas en el frontend.
