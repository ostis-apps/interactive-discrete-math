import { GraphNode, NodeType } from '@ennealand/enigraph'
import { AppWorkspace, Vertex } from '../core.ts'

const slice = (await AppWorkspace`example`.ref.one)!

console.log(await slice.elementVertex.ref.delete)
console.log(
  await slice.elementVertex.link(
    new Vertex({ name: 'A', type: NodeType.Const, x: -39, y: -13 }),
    new Vertex({ name: 'B', type: NodeType.Const, x: 131, y: -14 }),
    new Vertex({ name: 'C', type: NodeType.Const, x: -86, y: -57 })
  )
)
// console.log(await slice.elementVertex.get({ x: true, y: true, type: true, ref: { addr: 'id' } }))

/** Defines workspace state */
export const workspace = {
  /**
   * Array of verices data in the workspace
   */
  vertices: await slice.elementVertex.get({ x: true, y: true, type: true, ref: { addr: 'id' }, name: 'label' }).reactive,

  async addNode(node: GraphNode) {
    new AppWorkspace({ elementVertex: Vertex.element })
    const newVertex = await new Vertex({
      name: 'i',
      type: node.type,
      x: node.x,
      y: node.y,
      is: { elementVertex: AppWorkspace`example` },
    }).create
    this.vertices.push({ label: 'i', type: node.type, x: node.x, y: node.y, id: newVertex.ref.addr })
  },
}
