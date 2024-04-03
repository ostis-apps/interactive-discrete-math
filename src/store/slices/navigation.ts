import { computed, effect } from '@preact/signals'
import { magic } from '../core.ts'

export enum View {
  Landing = 'Landing',
  KnowledgeBase = 'KnowledgeBase',
  ConceptMap = 'ConceptMap',
  TaskModule = 'TaskModule',
  Playground = 'Playground',
}

const { AppNavigationSlice, AppView } = magic

const NavigationSlice = AppNavigationSlice`default`
if (!NavigationSlice) throw 'NavigationSlice does not exist.'

await NavigationSlice.current_view.unlink()
await NavigationSlice.current_view.link(AppView`landing`)
await NavigationSlice.current_addr.unlink()
await NavigationSlice.current_addr.link('__def__')

const [state] = await NavigationSlice.get({
  current_view: { name: 'view', ref: 'viewRef' },
  current_addr: 'current',
}).reactive

export const navigation = {
  view: computed(() => state.view as View),

  /**
   * #### The identifier of current sandbox object
   * In scweb, subscribe to this signal to update tabs accorddingly.
   * This way, the app's state remain independent from scweb.
   */
  current: computed(() => state.current),
  openTask(taskIdtf: string) {
    NavigationSlice.current_view.unlink(state.viewRef)
    NavigationSlice.current_view.link(AppView`task_module`)
    NavigationSlice.current_addr.unlink(state.current)
    NavigationSlice.current_addr.link(taskIdtf)
  },
  openSpace(spaceIdtf?: string) {
    if (!spaceIdtf) spaceIdtf = 'my-new-space-idtf'
    NavigationSlice.current_view.unlink(state.viewRef)
    NavigationSlice.current_view.link(AppView`playground`)
    NavigationSlice.current_addr.unlink(state.current)
    NavigationSlice.current_addr.link(spaceIdtf)
  },
  async gotoLanding() {
    NavigationSlice.current_view.unlink(state.viewRef)
    NavigationSlice.current_view.link(AppView`landing`)
  },
}

effect(async () => {
  console.warn('View', navigation.view.value)
  console.warn('Ref', state.viewRef.ref.addr)
})
