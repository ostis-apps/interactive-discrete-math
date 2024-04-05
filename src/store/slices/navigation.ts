import { AppNavigationSlice, AppView } from '../core.ts'

export enum View {
  Landing = 'Landing',
  KnowledgeBase = 'KnowledgeBase',
  ConceptMap = 'ConceptMap',
  TaskModule = 'TaskModule',
  Playground = 'Playground',
}

const slice = (await AppNavigationSlice`default`.ref.one)!

/** Defines general in-app navigation between different Views */
export const navigation = {
  /**
   * Currently active application view
   */
  view: await slice.current_view.name.one.reactive,

  /**
   * The identifier of current sandbox object
   */
  current: await slice.current_addr.one.reactive,

  /**
   * Opens a task module
   * @param taskId Id of the task module to open
   */
  openTask(taskId: string) {
    slice.current_view.update(AppView`task_module`)
    slice.current_addr.update(taskId)
  },

  /**
   * Opens a workspace (playground)
   * @param taskId Id of the workspace to open
   */
  openSpace(spaceId?: string) {
    if (!spaceId) spaceId = 'my-new-space-idtf'
    slice.current_view.update(AppView`playground`)
    slice.current_addr.update(spaceId)
  },

  /**
   * Switches back to Layout view
   */
  gotoLanding() {
    slice.current_view.update(AppView`landing`)
  },
}
