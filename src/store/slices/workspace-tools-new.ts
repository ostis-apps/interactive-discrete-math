import { effect } from '@preact/signals'
import { simulate } from '../../components/graph-editor/simulation.ts'
import { AgentArg, AgentType, AppWorkspace, ElementGroup, Group, Question, Runner, SetOfElementVertices } from '../core.ts'
import { workspaceToolsSlice } from './workspace-tools.ts'

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
      element_1: ElementGroup`${args[0]}`.to,
      element_2: ElementGroup`${args[1]}`.to,
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
    // Wrap the solution addr into RefValue
    const group = Group`${solution.value}`

    // Make the solution a Group
    await Group.element.link(group)

    // Get the list of actual vertices inside the solution graph
    const vertices = await group.element_vertex.ref.many
    console.log(vertices)

    // Generate positions of the vertices
    const nodes = vertices.map(vertex => ({ id: vertex.ref.addr, x: 0, y: 0, vertex }))
    simulate({ nodes, edges: [] }, { strength: -16 })

    // Create a set for new "views" of the vertices inside the workspace
    const elements = await new SetOfElementVertices().create

    // Create new "view" of the vertices inside the workspace and push it to the set
    const relations = await Promise.all(
      nodes.map(node => AppWorkspace`example`.elementVertex.link(node.vertex, { x: node.x, y: node.y, is: { element: elements } }))
    )

    // Assiciate new "view" of the group inside the workspace with the set of new "views" of the vertices
    console.log(relations.map(x => x.ref.addr))
    await elements.element.link(relations)

    // Create new "view" of the group inside the workspace with its attributes
    await AppWorkspace`example`.elementGroup.link(group, { elements })

    workspaceToolsSlice.resetArguments()
  })
}
