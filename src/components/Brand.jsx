import { assetUrl } from '../config'

export default function Brand({ onClick }) {
  return (
    <a
      href="#inicio"
      className="brand"
      onClick={onClick}
      aria-label="JasyTECH, inicio"
    >
      <img src={assetUrl('jasytech-icon.webp')} alt="" width="39" height="39" />
      <span>
        Jasy<span>TECH</span>
      </span>
    </a>
  )
}
