import { EdgeType, NodeType } from '@ennealand/enigraph'
import { AppWorkspace, Edge, ElementVertex, Vertex } from './core.ts'
import { ScType } from '@ennealand/enneract'

/**
 * Reset workspace sc-memory state to default mock state.
 */
export const resetWorkspace = async () => {
  console.groupCollapsed('Reset')
  // const slice = (await AppWorkspace`example`.ref.one)!
  // console.log(await slice.elementEdge.ref.delete)
  // console.log(await slice.elementVertex.ref.delete)
  // console.log(await slice.elementGroup.ref.delete)
  // const vertices = await new Vertex([
  //   { name: 'A', customType: NodeType.ConstClass, x: -39, y: -13 },
  //   { name: 'B', customType: NodeType.ConstClass, x: 131, y: -14 },
  //   { name: 'C', customType: NodeType.ConstClass, x: -86, y: -157 },
  // ]).create
  // console.log(await slice.elementVertex.link(vertices))
  // console.log(
  //   await slice.elementEdge.link(
  //     new Edge({ sc: ScType.EdgeAccessVarPosPerm, customType: EdgeType.EdgeConst, from: vertices[0], to: vertices[1] }),
  //     new Edge({ sc: ScType.EdgeAccessVarPosPerm, customType: EdgeType.EdgeConst, from: vertices[0], to: vertices[2] })
  //   )
  // )
  const slice = (await AppWorkspace`example`.ref.one)!
  console.log(await slice.elementEdge.ref.delete)
  console.log(await slice.elementVertex.ref.delete)
  console.log(await slice.elementGroup.ref.delete)

  const vertex1 = await new Vertex({
    name: 'A',
    customType: NodeType.ConstClass,
    is: { elementVertex: { value: slice, relation: { x: -39, y: -13 } } },
  }).create

  const vertex2 = await new Vertex({
    name: 'B',
    customType: NodeType.ConstClass,
    is: { elementVertex: { value: slice, relation: { x: 131, y: -14 } } },
  }).create

  const vertex3 = await new Vertex({
    name: 'C',
    customType: NodeType.ConstClass,
    is: { elementVertex: { value: slice, relation: { x: -86, y: -157 } } },
  }).create

  console.log(await vertex2.is.elementVertex.link(slice, { x: 10, y: 10 }))
  console.log(await slice.elementVertex.relation.ref.addr.many)

  console.log(vertex1.ref.addr, vertex2.ref.addr, vertex3.ref.addr)

  const edge1 = await new Edge({
    sc: ScType.EdgeAccessVarPosPerm,
    customType: EdgeType.EdgeConst,
    from: vertex1,
    to: vertex2,
    is: {
      elementEdge: {
        value: slice,
        relation: { source: ElementVertex`${vertex1.relations[0]}`, target: ElementVertex`${vertex2.relations[0]}` },
      },
    },
  }).create

  const edge2 = await new Edge({
    sc: ScType.EdgeAccessVarPosPerm,
    customType: EdgeType.EdgeConst,
    from: vertex1,
    to: vertex3,
    is: {
      elementEdge: {
        value: slice,
        relation: { source: ElementVertex`${vertex1.relations[0]}`, target: ElementVertex`${vertex3.relations[0]}` },
      },
    },
  }).create

  console.log(edge1.ref.addr, edge2.ref.addr)
  console.groupEnd()
}
