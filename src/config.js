export const company = {
  name: 'JasyTECH',
  email: 'jasytech.arg@gmail.com',
  github: 'https://github.com/jasytech',
}

export const assetUrl = (filename) =>
  `${import.meta.env.BASE_URL}assets/${filename}`

export const contactEndpoint = `https://formsubmit.co/ajax/${company.email}`
