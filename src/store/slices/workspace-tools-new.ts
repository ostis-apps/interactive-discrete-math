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
  console.log(args)
  const question = await new Question().create
  const runner = await new Runner().create
  await question.element.link(runner)
  await runner.element_1.link(Group`${args[0]}`)
  await runner.element_2.link(Group`${args[1]}`)
  await runner.element_3.link(AgentArg.$`nrel_graph_union`)
  await AgentType.$`question_using_binary_operation`.element.link(question)
  await AgentType.$`question_initiated`.element.link(question)
}
