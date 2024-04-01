import { slice } from './factory'

export enum View {
  Landing,
  KnowledgeBase,
  ConceptMap,
  TaskModule,
  Playground,
}

export const navigationSlice = slice({
  view: View.Landing,

  /**
   * #### The identifier of current sandbox object
   * In scweb, subscribe to this signal to update tabs accorddingly.
   * This way, the app's state remain independent from scweb.
   */
  current: '',

  openTask(taskIdtf: string) {
    this.current = taskIdtf
    this.view = View.TaskModule
  },

  openSpace(spaceIdtf?: string) {
    if (!spaceIdtf) spaceIdtf = 'my-new-space-idtf'
    this.current = spaceIdtf
    this.view = View.Playground
  },

  gotoLanding() {
    this.view = View.Landing
  },
})
