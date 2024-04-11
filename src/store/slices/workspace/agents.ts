// import { effect } from '@preact/signals'
import { actionsMenuSlice } from '.'
import { Action, ActiveAction, AppWorkspaceToolsSlice, ElementGroup, RefValue, SetOfGroups } from '../../core'
// import { simulate } from '../../../components/graph-editor/simulation.ts'
// import { AgentArg, AgentType, AppWorkspace, ElementGroup, Group, Question, Runner, SetOfElementVertices } from '../../core.ts'
export const slice = (await AppWorkspaceToolsSlice`default`.ref.one)!

export const executeAction = async (args: number[]) => {
  // const question = await new Question({
  //   element: new Runner({
  //     element_1: ElementGroup`${args[0]}`.to,
  //     element_2: ElementGroup`${args[1]}`.to,
  //     element_3: AgentArg.$`nrel_graph_union`,
  //   }),
  // }).create
  // await AgentType.$`question_using_binary_operation`.element.link(question)
  // await AgentType.$`question_initiated`.element.link(question)
  // console.log(question)

  // const solution = await question.answer.element_1.ref.addr.one.reactive

  // effect(async () => {
  //   console.log('Solution addr:', solution.value)
  //   if (!solution.value) return
  //   // Wrap the solution addr into RefValue
  //   const group = Group`${solution.value}`

  //   // Get the list of actual vertices inside the solution graph
  //   const vertices = await group.element_vertex.ref.many
  //   console.log(vertices)

  //   // Get the list of actual edges inside the solution graph
  //   const oredges = await group.element_oredge.get({ ref: true, from: { ref: { addr: 'from' } }, to: { ref: { addr: 'to' } } })

  //   // Create a set for new "views" of the vertices inside the workspace
  //   const elementsReq = new SetOfElementVertices().create

  //   // Generate positions of the vertices
  //   const nodes = vertices.map(vertex => ({ id: vertex.ref.addr, x: 0, y: 0, vertex }))
  //   const edges = oredges.map(edge => {
  //     const sourceIndex = nodes.findIndex(n => n.id === edge.from)
  //     const targetIndex = nodes.findIndex(n => n.id === edge.to)
  //     return { id: edge.ref.ref.addr, source: nodes[sourceIndex], target: nodes[targetIndex], sourceIndex, targetIndex, value: edge.ref }
  //   })
  //   simulate({ nodes, edges }, { strength: -16 })

  //   // Await the creation of a set for new "views" of the vertices inside the workspace
  //   const elements = await elementsReq

  //   // Create new "view" of the vertices inside the workspace and push it to the set
  //   const relations = await Promise.all(
  //     nodes.map(node => AppWorkspace`example`.elementVertex.link(node.vertex, { x: node.x, y: node.y, is: { element: elements } }))
  //   )

  //   // Create new "view" of the edges inside the workspace
  //   await Promise.all(
  //     edges.map(edge =>
  //       AppWorkspace`example`.elementEdge.link(edge.value, { source: relations[edge.sourceIndex], target: relations[edge.targetIndex] })
  //     )
  //   )

  //   await Promise.all([
  //     // Assiciate new "view" of the group inside the workspace with the set of new "views" of the vertices
  //     elements.element.link(relations),

  //     // Create new "view" of the group inside the workspace with its attributes
  //     AppWorkspace`example`.elementGroup.link(group, { elements }),

  //     // Make the solution a Group
  //     Group.element.link(group),
  //   ])
  //actionsMenuSlice.closeMenu()
  // })

  await slice.properties.element.link(
    new ActiveAction({
      action: Action`union`,
      args: new SetOfGroups({
        element_1: ElementGroup`${args[0]}` as never as RefValue<'ElementGroup_'>,
        element_2: ElementGroup`${args[1]}` as never as RefValue<'ElementGroup_'>,
      }),
    })
  )

  await actionsMenuSlice.closeMenu()
}
