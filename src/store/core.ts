import { Enneract } from '@ennealand/enneract'
import { DeepSignal } from 'deepsignal'
import type { Query } from '../../node_modules/@ennealand/enneract/dist/types/magic-types.d.ts'
import { App } from './types.ts'

const enneract = new Enneract<App>(`ws://localhost:${import.meta.env.VITE_MACHINE_PORT}/ws_json`)
export const { AppNavigationSlice, AppView, AppWorkspace, Edge, Graph, Group, Vertex } = enneract.magic as {
  AppNavigationSlice: Query<App, 'AppNavigationSlice'>
  AppView: Query<App, 'AppView'>
  AppWorkspace: Query<App, 'AppWorkspace'>
  Edge: Query<App, 'Edge'>
  Graph: Query<App, 'Graph'>
  Group: Query<App, 'Group'>
  Vertex: Query<App, 'Vertex'>
}

export const $extract = <T extends unknown>(args: T[]) => args[0] as Required<DeepSignal<T>>
