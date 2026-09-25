import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Brand from './Brand'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggle = useRef(null)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        closeMenu()
        toggle.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 761px)')
    const onResize = () => {
      if (desktop.matches) closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  return (
    <header className="navbar">
      <Brand onClick={closeMenu} />
      <button
        ref={toggle}
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav
        id="primary-navigation"
        aria-label="Navegación principal"
        className={menuOpen ? 'nav-links open' : 'nav-links'}
      >
        <a href="#servicios" onClick={closeMenu}>
          Servicios
        </a>
        <a href="#metodo" onClick={closeMenu}>
          Cómo trabajamos
        </a>
        <a href="#soluciones" onClick={closeMenu}>
          Soluciones
        </a>
        <a href="#contacto" className="nav-cta" onClick={closeMenu}>
          Hablemos <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  )
}
