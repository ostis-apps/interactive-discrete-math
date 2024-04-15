import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'
import './store/debug.ts'
import { links } from './store/slices/links.ts'

declare var SCWeb: any

export const mount = (id: string) => {
  const root = document.getElementById(id)!
  root.parentElement!.setAttribute('sc-addr-fmt', SCWeb.core.ComponentManager.getPrimaryFormatForExtLang(links.scnCode))
  render(<App />, root)
}
