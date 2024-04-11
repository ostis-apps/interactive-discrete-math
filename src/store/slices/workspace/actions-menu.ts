import { Signal, computed } from '@preact/signals'
import { Action, ActionClass, AgentType, AppWorkspaceToolsSlice, ElementGroup, WorkspaceMenu } from '../../core.ts'

const slice = (await AppWorkspaceToolsSlice`default`.ref.one)!

// ========================================================== //
// ================= Level 0 | Actions Menu ================= //
// ========================================================== //

const openedMenu = await slice.opened.where(WorkspaceMenu as never).ref.addr.one.reactive

const openActionsMenu = async () => {
  await slice.opened.link(WorkspaceMenu`actions` as never)
}

const closeMenu = async () => {
  await slice.opened.unlink()
}

const actionClasses = await WorkspaceMenu`actions`.decomposition.element.get({ name: true, icon: true, ref: true }).reactive
const actions = await WorkspaceMenu`actions`.decomposition.element.get({
  decomposition: { element: { name: 'name', ref: 'ref' } },
  ref: { addr: 'actionClassAddr' },
}).reactive

// ========================================================== //
// ================= Level 1 | Action Class ================= //
// ========================================================== //

const openedActionClass = await slice.opened.where(ActionClass as never).ref.addr.one.reactive
const openedActionClassName = computed(() => actionClasses.find(_ => _.ref.ref.addr === openedActionClass.value)?.name)

const openActionsClass = async (ref: unknown) => {
  await slice.opened.unlink(ActionClass.element as never, Action.element)
  await slice.opened.link(ref as never)
}

const closeActionClass = async () => {
  await slice.opened.unlink(ActionClass.element as never, Action.element)
}

// ========================================================== //
// ==================== Level 2 | Action ==================== //
// ========================================================== //

const openedAction = await slice.opened.where(Action).get({
  agentArg: { ref: 'agentArg' },
  agentType: { ref: { addr: 'agentTypeAddr' } },
  name: true,
}).reactive

const openAction = async (ref: unknown) => {
  await Promise.all([clearArgs(), slice.opened.unlink(Action.element)])
  await slice.opened.link(ref as never)
}

const closeAction = async () => {
  await slice.opened.unlink(Action.element)
}

// ========================================================== //
// ================== Level 3 | Action Arg ================== //
// ========================================================== //

const unaryOperation = await AgentType.$`question_using_unary_operation`.ref.addr.one
const binaryOperation = await AgentType.$`question_using_binary_operation`.ref.addr.one

const actionArgument1: Signal<number | undefined> = await slice.args.element_1.ref.addr.one.reactive
const actionArgument2: Signal<number | undefined> = await slice.args.element_2.ref.addr.one.reactive
const actionArgSelector: Signal<number | undefined> = await slice.argSelector.one.reactive

const openedArguments = computed(() => {
  if (!openedAction[0]) return []
  if (openedAction[0].agentTypeAddr === unaryOperation)
    return [{ title: 'Выберите граф', value: actionArgument1.value, selected: actionArgSelector.value === 0 }]
  if (openedAction[0].agentTypeAddr === binaryOperation)
    return [
      { title: 'Выберите граф', value: actionArgument1.value, selected: actionArgSelector.value === 0 },
      { title: 'Выберите граф', value: actionArgument2.value, selected: actionArgSelector.value === 1 },
    ]
  return []
})

const setArgSelector = async (index: number) => {
  if (actionArgSelector.value === index) {
    await slice.argSelector.unlink()
    return
  }

  if (actionArgSelector.value === undefined) await slice.argSelector.link(index)
  else await slice.argSelector.write(index)

  actionArgSelector.value = index
}

const clearArgs = async () => {
  return await Promise.all([slice.args.element_1.unlink(), slice.args.element_2.unlink(), slice.argSelector.unlink()])
}

// ========================================================== //
// ================ Level 4 | Group Selector ================ //
// ========================================================== //

type GroupSelection = { type: 'group'; action: (id: number) => void; values: Set<number>; indicators: Map<number, string> } | undefined
const groupSelection = computed<GroupSelection | undefined>(() => {
  if (actionArgSelector.value === undefined) return undefined

  const indicators = new Map()
  if (actionArgument1.value) indicators.set(actionArgument1.value, '1')
  if (actionArgument2.value) indicators.set(actionArgument2.value, '2')
  return {
    type: 'group',
    action: async (id: number) => {
      const current = actionArgSelector.value === 0 ? actionArgument1 : actionArgument2
      const another = actionArgSelector.value === 0 ? actionArgument2 : actionArgument1
      const currentElement = actionArgSelector.value === 0 ? slice.args.element_1 : slice.args.element_2
      const anotherElement = actionArgSelector.value === 0 ? slice.args.element_2 : slice.args.element_1
      if (another.value === id) {
        anotherElement.unlink()
        another.value = undefined
      }
      if (current.value === id) {
        currentElement.unlink()
        current.value = undefined
      } else {
        currentElement.update(ElementGroup`${id}` as never)
        current.value = id
      }
    },
    indicators,
    values: new Set(indicators.keys()),
  }
})

// ========================================================== //
// ======================== Exports ========================= //
// ========================================================== //

/** Actions Menu store slice */
export const actionsMenuSlice = {
  openedMenu,
  openActionsMenu,
  closeMenu,

  actionClasses,
  actions,

  openedActionClass,
  openActionsClass,
  closeActionClass,

  openAction,
  openedAction,
  closeAction,

  openedActionClassName,
  binaryOperation,
  unaryOperation,

  openedArguments,
  setArgSelector,
  clearArgs,

  groupSelection,
}
