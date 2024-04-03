import { computed } from '@preact/signals'
import { magic } from '../core.ts'

export enum View {
  Landing = 'Landing',
  KnowledgeBase = 'KnowledgeBase',
  ConceptMap = 'ConceptMap',
  TaskModule = 'TaskModule',
  Playground = 'Playground',
}

const { AppNavigationSlice, AppView } = magic

/** Define the Navigation Slice element */
const NavigationSlice = AppNavigationSlice`default`
if (!NavigationSlice) throw 'NavigationSlice does not exist.'

/** Set Navigation Slice to default values */
await NavigationSlice.current_view.relink(AppView`landing`)
await NavigationSlice.current_addr.relink('__def__')

/** Subscribe to Navigation Slice state */
const [state] = await NavigationSlice.get({
  current_view: { name: 'view', ref: 'viewRef' },
  current_addr: 'current',
}).reactive

/** Create Navigation Slice interface (getters & actions) */
export const navigation = {
  view: computed(() => state.view as View),

  /**
   * #### The identifier of current sandbox object
   * In scweb, subscribe to this signal to update tabs accorddingly.
   * This way, the app's state remain independent from scweb.
   */
  current: computed(() => state.current),

  openTask(taskIdtf: string) {
    NavigationSlice.current_view.relink(AppView`task_module`)
    NavigationSlice.current_addr.relink(taskIdtf)
  },
  
  openSpace(spaceIdtf?: string) {
    if (!spaceIdtf) spaceIdtf = 'my-new-space-idtf'
    NavigationSlice.current_view.relink(AppView`playground`)
    NavigationSlice.current_addr.relink(spaceIdtf)
  },
  
  gotoLanding() {
    NavigationSlice.current_view.relink(AppView`landing`)
  },
}
