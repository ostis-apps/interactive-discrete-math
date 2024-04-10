import { computed } from '@preact/signals';
import { Action, ActionClass, AppWorkspaceToolsSlice, WorkspaceMenu, AgentType } from '../core.ts';


const slice = (await AppWorkspaceToolsSlice`default`.ref.one)!


const openedMenu = await slice.opened.where(WorkspaceMenu as never).ref.addr.one.reactive

const openActionsMenu = async () => {
  await slice.opened.link(WorkspaceMenu`actions` as never)
}

const closeMenu = async () => {
  await slice.opened.unlink()
}

const actionClasses = await WorkspaceMenu`actions`.decomposition.element.get({ name: true, icon: true, ref: true }).reactive
const actions = await WorkspaceMenu`actions`.decomposition.element.get({ decomposition: { element: { name: 'name', ref: 'ref' } }, ref: { addr: 'actionClassAddr' } }).reactive



const openedActionClass = await slice.opened.where(ActionClass as never).ref.addr.one.reactive
const openedActionClassName = computed(() => actionClasses.find(_ => _.ref.ref.addr === openedActionClass.value)?.name)

const openActionsClass = async (ref: unknown) => {
  await slice.opened.unlink(ActionClass.element as never, Action.element)
  await slice.opened.link(ref as never)
}

const closeActionClass = async () => {
  await slice.opened.unlink(ActionClass.element as never, Action.element)
}




const openedAction = await slice.opened.where(Action as never).get({
  agentArg: { ref: 'agentArg' },
  agentType: { ref: { addr: 'agentTypeAddr' } },
  name: true
}).reactive
const unaryOperation = await AgentType.$`question_using_unary_operation`.ref.addr.one
const binaryOperation = await AgentType.$`question_using_binary_operation`.ref.addr.one

const actionArguments = await slice.args.element.ref.many.reactive
const actionArgSelector = await slice.argSelector.one.reactive

const openedArguments = computed(() => {
  if (!openedAction[0]) return []
  if (openedAction[0].agentTypeAddr === unaryOperation) return [
    { title: 'Выберите граф', value: actionArguments[0], selected: actionArgSelector.value === 0 }
  ]
  if (openedAction[0].agentTypeAddr === binaryOperation) return [
    { title: 'Выберите граф', value: actionArguments[0], selected: actionArgSelector.value === 0 },
    { title: 'Выберите граф', value: actionArguments[1], selected: actionArgSelector.value === 1 }
  ]
  return []
})

const openActions = async (ref: unknown) => {
  await slice.opened.unlink(Action.element as never)
  await slice.opened.link(ref as never)
}

const closeAction = async () => {
  await slice.opened.unlink(Action.element as never)
}

const setArgSelector = async (index: number) => {
  await slice.argSelector.write(index)
  actionArgSelector.value = index
}



type GroupSelection = { type: 'group'; action: (id: number) => void; values: Set<number>; indicators: Map<number, string> } | undefined
const groupSelection: GroupSelection | undefined = undefined


export const workspaceToolsNew = {
  openedMenu,
  openActionsMenu,
  closeMenu,

  actionClasses,
  actions,

  openedActionClass,
  openActionsClass,
  closeActionClass,

  openActions,
  openedAction,
  closeAction,
  
  openedActionClassName,
  binaryOperation,
  unaryOperation,

  openedArguments,
  actionArguments,
  setArgSelector,

  groupSelection,
}

















// const buttonsResponse = await AppWorkspaceTools`default`.buttons.element.get({ ref: true, name: 'title', icon: true })
// const buttons = Object.fromEntries(buttonsResponse.map(button => [button.ref.ref.addr, { title: button.title, icon: button.icon }]))

// console.log('buttons', buttons)

// const acitionsResponse = await AppWorkspaceTools`default`.buttons.element.get({
//   ref: 'buttonRef',
//   decomposition: {
//     element: {
//       name: 'title',
//       agentArg: { ref: 'agentArg' },
//       agentType: { ref: 'agentType' },
//       ref: 'ref',
//     },
//   },
// })

// const actions = acitionsResponse.map(({ ref, ...action }) => [ref.ref.addr, action])
// console.log('actions', actions)
