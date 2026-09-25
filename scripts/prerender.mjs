import { readFile, writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

// Generate the same React tree as the browser, so content is available before JS loads.
const server = await createServer({
  server: { middlewareMode: true, ws: false, hmr: false },
  appType: 'custom',
})
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const htmlPath = new URL('../dist/index.html', import.meta.url)
  const template = await readFile(htmlPath, 'utf8')
  const marker = '<div id="root"></div>'
  if (!template.includes(marker))
    throw new Error('No se encontró el contenedor para prerenderizar.')
  const markup = renderToString(createElement(App))
  await writeFile(
    htmlPath,
    template.replace(marker, `<div id="root">${markup}</div>`),
  )
  console.log('HTML prerenderizado correctamente.')
} finally {
  await server.close()
}
