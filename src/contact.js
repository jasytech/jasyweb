export function createContactSubject(name) {
  const date = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Cordoba',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date())
  const sender = name.trim().replace(/\s+/g, ' ')
  return `Consulta JasyTECH — ${sender} — ${date} (AR) [${crypto.randomUUID()}]`
}
