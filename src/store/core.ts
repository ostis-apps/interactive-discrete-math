import { Enneract } from '@ennealand/enneract'
import type { Magic } from '../../node_modules/@ennealand/enneract/dist/types/magic-types.js'
import { App } from './types.ts'
import { DeepSignal } from 'deepsignal'

const enneract = new Enneract<App>(`ws://localhost:${import.meta.env.VITE_MACHINE_PORT}/ws_json`)
export const magic = enneract.magic as Magic<App>

export const $extract = <T extends unknown>(args: T[]) => args[0] as Required<DeepSignal<T>>
