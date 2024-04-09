import { effect } from '@preact/signals'
import { AgentArg, AgentType, Group, Question, Runner } from '../core.ts'

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

export const executeAction = async (args: number[]) => {
  const question = await new Question({
    element: new Runner({
      element_1: Group`${args[0]}`,
      element_2: Group`${args[1]}`,
      element_3: AgentArg.$`nrel_graph_union`,
    }),
  }).create
  await AgentType.$`question_using_binary_operation`.element.link(question)
  await AgentType.$`question_initiated`.element.link(question)
  console.log(question)

  const solution = await question.answer.element_1.ref.addr.one.reactive

  effect(async () => {
    console.log('Solution addr:', solution.value)
    if (!solution.value) return
  })
}
