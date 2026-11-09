# CMASR-2 (PWA)

Versión web del Excel automatizado del CMASR-2 (Hoja de respuestas + Resultados).

## Publicar en GitHub Pages
1. Crea un repositorio en GitHub (por ejemplo `cmasr2`).
2. Sube TODO el contenido de esta carpeta a la raíz del repositorio (`index.html` debe quedar en la raíz).
3. En el repositorio: Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / carpeta `/ (root)` → Save.
4. Abre `https://TU-USUARIO.github.io/cmasr2/` y, desde el navegador del celular, elige "Instalar app" / "Agregar a pantalla de inicio".

Si cambias archivos, sube la nueva versión y cambia `V="cmasr2-v1"` en `sw.js` (p. ej. `v2`) para que se actualice la caché.

## Notas
- Las evaluaciones se guardan solo en el dispositivo (localStorage). Funciona sin internet una vez abierta.
- El login es una barrera de acceso básica en el navegador (contraseñas guardadas como hash SHA-256), no seguridad real: no guardes aquí datos que requieran protección fuerte.
- Basado en el Excel de Edgar Espinoza Jiménez. `data.js` contiene los baremos y textos extraídos del Excel.
