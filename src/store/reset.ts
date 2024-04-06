import { EdgeType, NodeType } from '@ennealand/enigraph'
import { AppWorkspace, Edge, Vertex } from './core.ts'
import { ScType } from '@ennealand/enneract'

/**
 * Reset workspace sc-memory state to default mock state.
 */
export const resetWorkspace = async () => {
  const slice = (await AppWorkspace`example`.ref.one)!
  console.log(await slice.elementEdge.ref.delete)
  console.log(await slice.elementVertex.ref.delete)
  console.log(await slice.elementGroup.ref.delete)
  const vertices = await new Vertex([
    { name: 'A', customType: NodeType.Const, x: -39, y: -13 },
    { name: 'B', customType: NodeType.Const, x: 131, y: -14 },
    { name: 'C', customType: NodeType.Const, x: -86, y: -157 },
  ]).create
  console.log(await slice.elementVertex.link(vertices))
  console.log(
    await slice.elementEdge.link(
      new Edge({ sc: ScType.EdgeAccessVarPosPerm, customType: EdgeType.EdgeConst, from: vertices[0], to: vertices[1] }),
      new Edge({ sc: ScType.EdgeAccessVarPosPerm, customType: EdgeType.EdgeConst, from: vertices[0], to: vertices[2] })
    )
  )
}
