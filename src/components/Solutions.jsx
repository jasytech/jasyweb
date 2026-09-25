import { MoveRight } from 'lucide-react'

const solutions = [
  {
    tag: 'Producto digital',
    title: 'Gestión de equipos',
    desc: 'Una plataforma para organizar tareas, equipos y proyectos en un mismo lugar.',
    color: 'blue',
    mark: '01',
  },
  {
    tag: 'E-commerce',
    title: 'Tienda online',
    desc: 'Una experiencia de compra clara para acercar tus productos a más personas.',
    color: 'green',
    mark: '02',
  },
  {
    tag: 'Plataforma',
    title: 'Panel de datos',
    desc: 'Información conectada y fácil de interpretar para acompañar tus decisiones.',
    color: 'ink',
    mark: '03',
  },
]

export default function Solutions() {
  return (
    <section id="soluciones" className="projects band light-band">
      <div className="section-heading project-heading">
        <div className="section-label">
          04 <span>Posibles soluciones</span>
        </div>
        <div>
          <h2>
            Ideas para
            <br />
            <em>tu próximo paso.</em>
          </h2>
          <p className="section-description">
            Estos son ejemplos de lo que podemos construir juntos; no son
            proyectos realizados ni casos de clientes.
          </p>
        </div>
      </div>
      <div className="project-grid">
        {solutions.map((solution) => (
          <article
            className={`project-card ${solution.color}`}
            key={solution.title}
          >
            <div className="project-mark" aria-hidden="true">
              {solution.mark}
            </div>
            <span>{solution.tag}</span>
            <h3>{solution.title}</h3>
            <p>{solution.desc}</p>
            <a
              className="solution-link"
              href="#contacto"
              aria-label={`Consultar por ${solution.title.toLowerCase()}`}
            >
              Hablemos de tu idea <MoveRight size={18} />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
