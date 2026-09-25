import { test, expect } from '@playwright/test'

test('carga sin errores y todos los recursos usan la ruta de GitHub Pages', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|react/i.test(message.text()))
      errors.push(message.text())
  })
  const failedResources = []
  page.on('response', (response) => {
    if (
      response.url().startsWith('http://127.0.0.1:4173') &&
      response.status() >= 400
    )
      failedResources.push(response.url())
  })
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Ideas que encuentran',
  )
  const images = page.locator('img')
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('src', /^\/jasyweb\/assets\//)
    await expect
      .poll(() =>
        image.evaluate(
          (element) => element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true)
  }
  const background = await page
    .locator('.page-background')
    .evaluate((element) => getComputedStyle(element).backgroundImage)
  expect(background).toContain('/jasyweb/assets/hero.webp')
  await expect(
    page.getByRole('link', { name: /JasyTECH en GitHub/ }),
  ).toHaveAttribute('href', 'https://github.com/jasytech')
  expect(errors).toEqual([])
  expect(failedResources).toEqual([])
})

const endpoint = 'https://formsubmit.co/ajax/9f458978d2f1ff778292628e60f23595'

async function fillContact(page) {
  await page.goto('./#contacto')
  await page.getByLabel('Tu nombre', { exact: true }).fill('María & Juan')
  await page
    .getByLabel('Tu email', { exact: true })
    .fill('maria+web@example.com')
  await page
    .getByLabel('Contanos un poco')
    .fill('Hola, ¿podemos hablar?\nPresupuesto: $100 & más.')
}

test('envía los campos al servicio, bloquea duplicados y confirma solo después de la respuesta', async ({
  page,
}) => {
  let release
  let payload
  let requests = 0
  const gate = new Promise((resolve) => {
    release = resolve
  })
  await page.route(endpoint, async (route) => {
    requests++
    payload = route.request().postDataJSON()
    await gate
    await route.fulfill({ json: { success: 'true', message: 'Success' } })
  })
  await fillContact(page)
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(page.getByRole('button', { name: 'Enviando…' })).toBeDisabled()
  await expect(page.getByRole('status')).toBeEmpty()
  await expect.poll(() => requests).toBe(1)
  expect(payload).toMatchObject({
    name: 'María & Juan',
    email: 'maria+web@example.com',
    message: 'Hola, ¿podemos hablar?\nPresupuesto: $100 & más.',
    _subject: expect.stringContaining('Consulta JasyTECH — María & Juan — '),
  })
  release()
  await expect(page.getByRole('status')).toContainText('Mensaje enviado')
  await expect(page.getByLabel('Tu nombre', { exact: true })).toHaveValue('')
  await expect(
    page.getByRole('button', { name: 'Enviar mensaje' }),
  ).toBeEnabled()
  expect(requests).toBe(1)
})

test('dos consultas idénticas en el mismo instante tienen asuntos distintos', async ({
  page,
}) => {
  const subjects = []
  await page.clock.setFixedTime(new Date('2026-09-25T03:38:15Z'))
  await page.route(endpoint, async (route) => {
    subjects.push(route.request().postDataJSON()._subject)
    await route.fulfill({ json: { success: true } })
  })
  for (let index = 0; index < 2; index++) {
    await fillContact(page)
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect(page.getByRole('status')).toContainText('Mensaje enviado')
  }
  expect(subjects).toHaveLength(2)
  for (const subject of subjects) {
    expect(subject).toContain('Consulta JasyTECH — María & Juan — 25/09/2026')
    expect(subject).toContain('00:38:15 (AR)')
    expect(subject).toMatch(
      /\[[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\]$/,
    )
  }
  expect(subjects[0]).not.toBe(subjects[1])
})

for (const width of [390, 1440]) {
  test(`el fondo queda fijo y el hero es compacto a ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await page.evaluate(() => document.fonts.ready)
    const background = page.locator('.page-background')
    const initial = await background.boundingBox()
    expect(initial).toEqual({ x: 0, y: 0, width, height: 900 })
    const hero = await page.locator('.hero').boundingBox()
    expect(hero.height).toBeLessThan(width === 390 ? 500 : 600)
    await expect(background).toHaveAttribute('aria-hidden', 'true')
    await page.screenshot({ path: testInfo.outputPath('inicio.png') })
    for (const section of [
      '.intro',
      '#servicios',
      '#metodo',
      '#soluciones',
      '#contacto',
    ]) {
      await page
        .locator(section)
        .evaluate((element) => element.scrollIntoView())
      expect(await background.boundingBox()).toEqual(initial)
      const color = await page
        .locator(section)
        .evaluate((element) => getComputedStyle(element).backgroundColor)
      expect(color).toMatch(/^rgba\(/)
    }
    expect(
      await page
        .locator('.hero')
        .evaluate((element) => element.getBoundingClientRect().top),
    ).toBeLessThan(0)
    await expect(
      page.getByRole('button', { name: 'Enviar mensaje' }),
    ).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('contacto.png') })
    await page
      .locator('#servicios')
      .evaluate((element) => element.scrollIntoView())
    await page.screenshot({ path: testInfo.outputPath('servicios.png') })
  })
}

for (const failure of [
  'network',
  'http',
  'rejected',
  'invalid-json',
  'activation',
]) {
  test(`conserva los datos y no muestra éxito ante ${failure}`, async ({
    page,
  }) => {
    await page.route(endpoint, async (route) => {
      if (failure === 'network') return route.abort()
      if (failure === 'http')
        return route.fulfill({ status: 500, json: { success: true } })
      if (failure === 'rejected')
        return route.fulfill({ json: { success: 'false' } })
      if (failure === 'invalid-json') return route.fulfill({ body: 'Not JSON' })
      return route.fulfill({
        json: { success: true, message: 'Please activate your form' },
      })
    })
    await fillContact(page)
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    if (failure === 'activation')
      await expect(page.getByRole('status')).toContainText(
        'no pudimos confirmar',
      )
    else
      await expect(page.getByRole('alert')).toContainText(
        'No pudimos confirmar',
      )
    await expect(page.getByRole('status')).not.toContainText('Mensaje enviado')
    await expect(page.getByLabel('Tu nombre', { exact: true })).toHaveValue(
      'María & Juan',
    )
    await expect(page.getByLabel('Contanos un poco')).toHaveValue(
      'Hola, ¿podemos hablar?\nPresupuesto: $100 & más.',
    )
    await expect(
      page.getByRole('button', { name: 'Enviar mensaje' }),
    ).toBeEnabled()
    await page.unroute(endpoint)
    await page.route(endpoint, (route) =>
      route.fulfill({ json: { success: true } }),
    )
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect(page.getByRole('status')).toContainText('Mensaje enviado')
  })
}

test('rechaza campos vacíos, email inválido y texto compuesto solo por espacios', async ({
  page,
}) => {
  let requests = 0
  await page.route(endpoint, (route) => {
    requests++
    return route.fulfill({ json: { success: true } })
  })
  await page.goto('./#contacto')
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()
  await page.getByLabel('Tu nombre', { exact: true }).fill('Ana')
  await page.getByLabel('Tu email', { exact: true }).fill('correo-invalido')
  await page.getByLabel('Contanos un poco').fill('Hola')
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()
  expect(
    await page
      .getByLabel('Tu email', { exact: true })
      .evaluate((element) => element.validity.typeMismatch),
  ).toBe(true)
  await page.getByLabel('Tu email', { exact: true }).fill('ana@example.com')
  await page.getByLabel('Contanos un poco').fill('   ')
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()
  expect(
    await page
      .getByLabel('Contanos un poco')
      .evaluate((element) => element.validity.customError),
  ).toBe(true)
  expect(requests).toBe(0)
  await page.getByLabel('Contanos un poco').fill('Ahora sí')
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(page.getByRole('status')).toContainText('Mensaje enviado')
  expect(requests).toBe(1)
})

test('menú móvil accesible con teclado, Escape, enlaces y cambio de tamaño', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  const nav = page.getByRole('navigation', { includeHidden: true })
  const toggle = page.locator('.menu-toggle')
  await expect(nav).toBeHidden()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Saltar al contenido' }),
  ).toBeFocused()
  await toggle.focus()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Contanos tu idea para conocerte mejor' }),
  ).toBeFocused()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(nav).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(nav).toBeHidden()
  await expect(toggle).toBeFocused()
  await toggle.click()
  await nav.getByRole('link', { name: 'Soluciones' }).click()
  await expect(page).toHaveURL(/#soluciones$/)
  await expect(nav).toBeHidden()
  await page.goto('./')
  await toggle.click()
  await page.setViewportSize({ width: 1280, height: 900 })
  await expect(nav).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(nav).toBeHidden()
})

test('las soluciones son ejemplos y todos los enlaces internos tienen destino', async ({
  page,
}) => {
  await page.goto('./')
  await expect(
    page.getByText('Estos son ejemplos', { exact: false }),
  ).toContainText('no son proyectos realizados')
  await expect(page.getByRole('link', { name: /^Consultar por/ })).toHaveCount(
    3,
  )
  const broken = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href) => !document.getElementById(href.slice(1))),
    )
  expect(broken).toEqual([])
  await expect(
    page.locator(
      'a[href*="wa.me"], a[href="https://www.linkedin.com"], a[href="https://www.instagram.com"]',
    ),
  ).toHaveCount(0)
})

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`el contenido no se desborda a ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('./')
    const overflowing = await page
      .locator(
        'h1, h2, h3, p, input, textarea, .email-link, .project-card, .service-item',
      )
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect()
            return (
              rect.width > 0 &&
              (rect.left < -1 ||
                rect.right > window.innerWidth + 1 ||
                element.scrollWidth > element.clientWidth + 2)
            )
          })
          .map((element) => ({
            tag: element.tagName,
            text: element.textContent.slice(0, 60),
          })),
      )
    expect(overflowing).toEqual([])
    if ([390, 1440].includes(width)) {
      await page.screenshot({
        path: testInfo.outputPath(`sitio-${width}.png`),
        fullPage: true,
      })
    }
  })
}

test('respeta movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  expect(
    await page
      .locator('html')
      .evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe('auto')
})

test('el HTML contiene el sitio y el contacto incluso sin JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/jasyweb/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Ideas que encuentran',
  )
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(
    page
      .getByRole('link', { name: 'jasytech.arg@gmail.com', exact: true })
      .first(),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Enviar mensaje' }),
  ).toBeHidden()
  await context.close()
})
