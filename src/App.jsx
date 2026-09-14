import { useState } from 'react'
import {
  ArrowUpRight, Check, Code2, Database, Globe2,
  Link, Menu, MessageCircle, MoveRight, ShieldCheck, Sparkles, X
} from 'lucide-react'
import Hero from './components/Hero'

const services = [
  { icon: Code2, number: '01', title: 'Desarrollo a medida', text: 'Productos digitales robustos que se adaptan a la forma real de trabajar de tu negocio.' },
  { icon: Globe2, number: '02', title: 'Experiencias web', text: 'Sitios y plataformas que combinan claridad, velocidad y una identidad que se recuerda.' },
  { icon: Database, number: '03', title: 'Datos que deciden', text: 'Sistemas conectados para convertir información dispersa en decisiones más simples.' },
  { icon: ShieldCheck, number: '04', title: 'Tecnología confiable', text: 'Arquitecturas escalables, seguras y preparadas para acompañar el crecimiento.' },
]

const projects = [
  { tag: 'Producto digital', title: 'Nativa', desc: 'Una nueva forma de gestionar equipos y proyectos.', color: 'blue', mark: 'N' },
  { tag: 'E-commerce', title: 'Verde Sur', desc: 'Tecnología para consumir mejor, todos los días.', color: 'green', mark: 'VS' },
  { tag: 'Plataforma', title: 'Cauce', desc: 'Datos claros para decisiones que hacen avanzar.', color: 'ink', mark: 'C' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const closeMenu = () => setMenuOpen(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }

  return <div className="site-shell">
    <header className="navbar">
      <a href="#inicio" className="brand" onClick={closeMenu} aria-label="JasyTECH, inicio">
        <img src="/assets/jasytech-icon.png" alt="" />
        <span>Jasy<span>TECH</span></span>
      </a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#servicios" onClick={closeMenu}>Servicios</a>
        <a href="#metodo" onClick={closeMenu}>Cómo trabajamos</a>
        <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
        <a href="#contacto" className="nav-cta" onClick={closeMenu}>Hablemos <ArrowUpRight size={16} /></a>
      </nav>
    </header>

    <main>
      <Hero
        eyebrow="Tecnología con propósito"
        title="Ideas que encuentran"
        titleAccent="su mejor forma."
        description="Creamos software que conecta personas, simplifica lo complejo y abre nuevas posibilidades para tu negocio."
        ctaLabel="Contanos tu idea"
        ctaHref="#contacto"
        footerLabel="Software para un mundo mejor"
        footerPage="01 / 04"
      />

      <section className="intro band">
        <div className="section-label">01 <span>Quiénes somos</span></div>
        <div className="intro-copy"><h2>La tecnología es una herramienta.<br /><strong>El impacto, nuestra medida.</strong></h2><p>Somos un equipo de personas curiosas que diseña y construye soluciones digitales con una mirada humana. Nos involucramos en cada desafío para que la tecnología trabaje a favor de quienes la usan.</p><a href="#contacto" className="text-link">Conocé nuestra forma de pensar <MoveRight size={17} /></a></div>
      </section>

      <section id="servicios" className="services band light-band">
        <div className="section-heading"><div className="section-label">02 <span>Lo que hacemos</span></div><h2>Del primer boceto<br /><em>a algo que transforma.</em></h2></div>
        <div className="service-grid">{services.map(({ icon: Icon, number, title, text }) => <article className="service-item" key={number}><div className="service-top"><Icon size={25} strokeWidth={1.5} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p><span className="service-arrow"><ArrowUpRight size={18} /></span></article>)}</div>
      </section>

      <section id="metodo" className="method band">
        <div className="section-label">03 <span>Cómo trabajamos</span></div>
        <div className="method-layout"><div><h2>Un proceso claro.<br /><em>Resultados que perduran.</em></h2><p>Creemos que los mejores productos nacen de escuchar bien, pensar juntos y avanzar con intención.</p></div><div className="steps"><div><b>01</b><h3>Entender</h3><p>Nos sumergimos en tu contexto, tus usuarios y el desafío que querés resolver.</p></div><div><b>02</b><h3>Crear</h3><p>Convertimos las ideas en experiencias simples, útiles y visualmente honestas.</p></div><div><b>03</b><h3>Impulsar</h3><p>Lanzamos, medimos y mejoramos para que tu producto siga creciendo.</p></div></div></div>
      </section>

      <section id="proyectos" className="projects band light-band"><div className="section-heading project-heading"><div className="section-label">04 <span>Proyectos seleccionados</span></div><h2>Hecho para<br /><em>moverse.</em></h2></div><div className="project-grid">{projects.map(project => <article className={`project-card ${project.color}`} key={project.title}><div className="project-mark">{project.mark}</div><span>{project.tag}</span><h3>{project.title}</h3><p>{project.desc}</p><button aria-label={`Ver proyecto ${project.title}`}><ArrowUpRight size={19} /></button></article>)}</div></section>

      <section id="contacto" className="contact band"><div className="contact-info"><div className="section-label">05 <span>Contacto</span></div><h2>Hagamos algo<br /><em>que importe.</em></h2><p>¿Tenés un desafío en mente? Nos encantaría escucharlo.</p><a href="mailto:hola@jasytech.com" className="email-link">hola@jasytech.com <ArrowUpRight size={18} /></a></div><form className="contact-form" onSubmit={handleSubmit}><label>Tu nombre<input name="name" required placeholder="¿Cómo te llamás?" /></label><label>Tu email<input name="email" type="email" required placeholder="nombre@empresa.com" /></label><label>Contanos un poco<textarea name="message" required rows="3" placeholder="¿En qué podemos ayudarte?" /></label><button className="button button-primary" type="submit">Enviar mensaje <MoveRight size={18} /></button>{sent && <p className="success"><Check size={16} /> Mensaje preparado. Te responderemos pronto.</p>}</form></section>
    </main>

    <footer className="footer"><a href="#inicio" className="brand"><img src="/assets/jasytech-icon.png" alt="" /><span>Jasy<span>TECH</span></span></a><p>Software para un mundo mejor.</p><div className="socials"><a href="https://www.linkedin.com" aria-label="LinkedIn"><Link size={18} /></a><a href="https://www.instagram.com" aria-label="Instagram"><Sparkles size={18} /></a><a href="https://wa.me/5490000000000" aria-label="WhatsApp"><MessageCircle size={18} /></a></div><small>© 2026 JasyTECH</small></footer>
  </div>
}

export default App
