import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'
import './api/index.ts'

export const mount = (id: string) => render(<App />, document.getElementById(id)!)
