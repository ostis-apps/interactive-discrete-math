import { Enneract } from '@ennealand/enneract'
import { DeepSignal } from 'deepsignal'
import type { Magic } from '../../node_modules/@ennealand/enneract/dist/types/magic-types.d.ts'
import { App } from './types.ts'

const enneract = new Enneract<App>(`ws://localhost:${import.meta.env.VITE_MACHINE_PORT}/ws_json`)
export const {
  AppNavigationSlice,
  AppView,
  AppWorkspace,
  Edge,
  Graph,
  Group,
  Vertex,
  AppWorkspaceTools,
  SetOfButtons,
  Button,
  SetOfActions,
  Action,
  AgentArg,
  AgentType,
} = enneract.magic as Magic<App>

export const $extract = <T extends unknown>(args: T[]) => args[0] as Required<DeepSignal<T>>
