import {
  ArrowUpRight,
  Code2,
  Database,
  Globe2,
  MoveRight,
  ShieldCheck,
} from 'lucide-react'
import Hero from './components/Hero'
import Header from './components/Header'
import Solutions from './components/Solutions'
import Contact from './components/Contact'
import Footer from './components/Footer'

const services = [
  {
    icon: Code2,
    number: '01',
    title: 'Desarrollo a medida',
    text: 'Productos digitales robustos que se adaptan a la forma real de trabajar de tu negocio.',
  },
  {
    icon: Globe2,
    number: '02',
    title: 'Experiencias web',
    text: 'Sitios y plataformas que combinan claridad, velocidad y una identidad que se recuerda.',
  },
  {
    icon: Database,
    number: '03',
    title: 'Datos que deciden',
    text: 'Sistemas conectados para convertir información dispersa en decisiones más simples.',
  },
  {
    icon: ShieldCheck,
    number: '04',
    title: 'Tecnología confiable',
    text: 'Arquitecturas escalables, seguras y preparadas para acompañar el crecimiento.',
  },
]

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero
          eyebrow="Tecnología con propósito"
          title="Ideas que encuentran"
          titleAccent="su mejor forma."
          description="Creamos software que conecta personas, simplifica lo complejo y abre nuevas posibilidades para tu negocio."
          ctaLabel="Contanos tu idea para conocerte mejor"
          ctaHref="#contacto"
          footerLabel="Software para un mundo mejor"
        />

        <section className="intro band">
          <div className="section-label">
            01 <span>Quiénes somos</span>
          </div>
          <div className="intro-copy">
            <h2>
              La tecnología es una herramienta.
              <br />
              <strong>El impacto, nuestra medida.</strong>
            </h2>
            <p>
              Somos un equipo de personas curiosas que diseña y construye
              soluciones digitales con una mirada humana. Nos involucramos en
              cada desafío para que la tecnología trabaje a favor de quienes la
              usan.
            </p>
            <a href="#contacto" className="text-link">
              Conocé nuestra forma de pensar <MoveRight size={17} />
            </a>
          </div>
        </section>

        <section id="servicios" className="services band light-band">
          <div className="section-heading">
            <div className="section-label">
              02 <span>Lo que hacemos</span>
            </div>
            <h2>
              Del primer boceto
              <br />
              <em>a algo que transforma.</em>
            </h2>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, number, title, text }) => (
              <article className="service-item" key={number}>
                <div className="service-top">
                  <Icon size={25} strokeWidth={1.5} />
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="service-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section id="metodo" className="method band">
          <div className="section-label">
            03 <span>Cómo trabajamos</span>
          </div>
          <div className="method-layout">
            <div>
              <h2>
                Un proceso claro.
                <br />
                <em>Resultados que perduran.</em>
              </h2>
              <p>
                Creemos que los mejores productos nacen de escuchar bien, pensar
                juntos y avanzar con intención.
              </p>
            </div>
            <div className="steps">
              <div>
                <b>01</b>
                <h3>Entender</h3>
                <p>
                  Nos sumergimos en tu contexto, tus usuarios y el desafío que
                  querés resolver.
                </p>
              </div>
              <div>
                <b>02</b>
                <h3>Crear</h3>
                <p>
                  Convertimos las ideas en experiencias simples, útiles y
                  visualmente honestas.
                </p>
              </div>
              <div>
                <b>03</b>
                <h3>Impulsar</h3>
                <p>
                  Lanzamos, medimos y mejoramos para que tu producto siga
                  creciendo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Solutions />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
