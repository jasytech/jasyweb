import { MoveRight, Sparkles } from 'lucide-react'

function Hero({
  eyebrow = 'Tecnología con propósito',
  title = 'Ideas que encuentran',
  titleAccent = 'su mejor forma.',
  description = 'Creamos software que conecta personas, simplifica lo complejo y abre nuevas posibilidades para tu negocio.',
  ctaLabel = 'Contanos tu idea',
  ctaHref = '#contacto',
  footerLabel = 'Software para un mundo mejor',
  footerPage = '01 / 04',
}) {
  return (
    <section id="inicio" className="hero">
      <div className="hero-art" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow"><Sparkles size={15} /> {eyebrow}</p>
        <h1>{title}<br /><em>{titleAccent}</em></h1>
        <p className="hero-copy">{description}</p>
        <a href={ctaHref} className="button button-primary">{ctaLabel} <MoveRight size={18} /></a>
      </div>
      <div className="hero-footer"><span>{footerLabel}</span><span>{footerPage}</span></div>
    </section>
  )
}

export default Hero
