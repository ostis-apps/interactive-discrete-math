import { ReadonlySignal, Signal, computed, effect, signal } from '@preact/signals'
import { ActiveAction, AppWorkspaceToolsSlice, RefValue } from '../../core.ts'
const slice = (await AppWorkspaceToolsSlice`default`.ref.one)!

const activeActionRefs = await slice.properties.element.get({
  ref: { addr: 'addr' },
  args: { ref: 'argsRef' },
  action: { ref: 'actionRef' },
}).reactive

type Args = {
  addr: number
  args: number[]
  answer: number
  agent: { agentArg: RefValue<'AgentArg'>; agentType: RefValue<'AgentType'>; name: string }
} & Disposable
const args: Signal<ReadonlySignal<Args[]>> = signal(signal([]))

effect(async () => {
  for (const arg of args.peek().peek()) arg[Symbol.dispose]()
  console.logDeepPink('Unsubscribed from active actions:', args.peek().peek().length)
  const signals = await Promise.all(
    activeActionRefs.map(action =>
      Promise.all([
        action.addr,
        action.argsRef.element_1.ref.addr.one.reactive,
        action.argsRef.element_2.ref.addr.one.reactive,
        action.argsRef.element_3.ref.addr.one.reactive,
        action.actionRef.get({ agentArg: { ref: 'agentArg' }, agentType: { ref: 'agentType' }, name: true }).reactive,
      ])
    )
  )

  args.value = computed(() =>
    signals.map(([addr, e1, e2, e3, agent]) => ({
      addr,
      args: [e1.value, e2.value],
      answer: e3.value,
      agent: agent[0],
      [Symbol.dispose]: () => (e1[Symbol.dispose](), e2[Symbol.dispose](), agent[Symbol.dispose]()),
    }))
  )
  console.logMediumSeaGreen('Subscribed to active actions:', signals.length)
  return () => {
    console.logDeepPink('Unsubscribed from active actions:')
    signals.forEach(args => args.forEach(arg => typeof arg === 'object' && arg[Symbol.dispose]()))
  }
})

const activeActions = computed(() => args.value.value)

const deleteActiveAction = (addr: number) => {
  ActiveAction`${addr}`.ref.delete
} 

export const activeActionsSlice = {
  activeActions,
  deleteActiveAction,
}
