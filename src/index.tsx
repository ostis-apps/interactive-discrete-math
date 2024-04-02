import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'

export const mount = (id: string) => render(<App />, document.getElementById(id)!)
