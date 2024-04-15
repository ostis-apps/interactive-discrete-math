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
  Group,
  Vertex,
  ElementVertex,
  ElementEdge,
  ElementGroup,
  NumericValue,
  SetOfElementVertices,
  ActionClass,
  ActiveAction,
  ActiveActionStatus,
  AppWorkspaceToolsSlice,
  SetOfActionClasses,
  SetOfActiveActions,
  SetOfGroups,
  WorkspaceMenu,
  SetOfActions,
  Action,
  AgentArg,
  AgentType,
  Question,
  Runner,
} = enneract.magic as Magic<App>

export type RefValue<T extends keyof App> = NonNullable<Awaited<Magic<App>[T]['element']['ref']['one']>>

export const $extract = <T extends unknown>(args: T[]) => args[0] as Required<DeepSignal<T>>
