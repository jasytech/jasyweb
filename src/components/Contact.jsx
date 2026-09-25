import { useRef, useState } from 'react'
import { ArrowUpRight, Check, MoveRight } from 'lucide-react'
import { company, contactEndpoint } from '../config'
import { createContactSubject } from '../contact'

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const submitting = useRef(false)
  const sending = status === 'sending'

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const fields = Object.fromEntries(data.entries())
    for (const name of ['name', 'email', 'message']) {
      const input = event.currentTarget.elements.namedItem(name)
      input.setCustomValidity(fields[name].trim() ? '' : 'Completá este campo.')
    }
    if (!form.reportValidity() || fields._honey) return
    submitting.current = true
    setStatus('sending')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          _subject: createContactSubject(fields.name),
          _template: 'table',
          _url: 'https://jasytech.github.io/jasyweb/',
          _honey: '',
        }),
      })
      const result = await response.json()
      if (!response.ok || ![true, 'true'].includes(result.success)) {
        throw new Error('El servicio no confirmó el envío.')
      }
      if (
        /activat|confirm.{0,40}email|verify.{0,40}email/i.test(
          result.message || '',
        )
      ) {
        setStatus('pending')
      } else {
        setStatus('success')
        form.reset()
      }
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timeout)
      submitting.current = false
    }
  }

  return (
    <section id="contacto" className="contact band">
      <div className="contact-info">
        <div className="section-label">
          05 <span>Contacto</span>
        </div>
        <h2>
          Hagamos algo
          <br />
          <em>que importe.</em>
        </h2>
        <p>¿Tenés un desafío en mente? Nos encantaría escucharlo.</p>
        <a href={`mailto:${company.email}`} className="email-link">
          {company.email} <ArrowUpRight size={18} />
        </a>
      </div>
      <form
        className="contact-form"
        onSubmit={handleSubmit}
        onInput={(event) => {
          event.target.setCustomValidity?.('')
          if (!submitting.current) setStatus('idle')
        }}
        aria-busy={sending}
      >
        <label>
          Tu nombre
          <input
            name="name"
            autoComplete="name"
            required
            disabled={sending}
            maxLength={100}
            placeholder="¿Cómo te llamás?"
          />
        </label>
        <label>
          Tu email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={sending}
            maxLength={254}
            placeholder="nombre@empresa.com"
          />
        </label>
        <label>
          Contanos un poco
          <textarea
            name="message"
            required
            disabled={sending}
            maxLength={1500}
            rows="3"
            placeholder="¿En qué podemos ayudarte?"
          />
        </label>
        <input
          type="text"
          name="_honey"
          className="honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          className="button button-primary"
          type="submit"
          disabled={sending}
        >
          {sending ? 'Enviando…' : 'Enviar mensaje'} <MoveRight size={18} />
        </button>
        <p className="success" role="status">
          {status === 'success' && (
            <>
              <Check size={16} /> Mensaje enviado. Gracias por escribirnos.
            </>
          )}
          {status === 'pending' &&
            'Todavía no pudimos confirmar el envío. Por favor, escribinos directamente al email de arriba. Conservamos tu mensaje en el formulario.'}
        </p>
        {status === 'error' && (
          <p className="form-error" role="alert">
            No pudimos confirmar el envío. Tus datos siguen acá: podés volver a
            intentarlo o escribirnos a {company.email}.
          </p>
        )}
      </form>
    </section>
  )
}
