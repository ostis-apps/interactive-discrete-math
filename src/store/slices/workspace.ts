import { GraphEdge, GraphNode } from '@ennealand/enigraph'
import { ScType } from '@ennealand/enneract'
import { computed } from '@preact/signals'
import { AppWorkspace, Edge, Vertex } from '../core.ts'
import { $defined } from '../store.ts'

const slice = (await AppWorkspace`example`.ref.one)!

// Reset the workspace state:
// await import('../reset.ts').then(mod => mod.resetWorkspace())

/**
 * Array of verices data in the workspace
 */
const vertices = await slice.elementVertex.get({ x: true, y: true, customType: 'type', ref: { addr: 'id' }, name: 'label' }).reactive

/**
 * Array of edges data in the workspace
 */
const edgeIds = await slice.elementEdge.get({
  from: { ref: { addr: 'from' } },
  to: { ref: { addr: 'to' } },
  customType: 'type',
  ref: { addr: 'id' },
}).reactive

/**
 * Array of edges data in the workspace with sources and targets mapped to reactive vertices
 */
const edges = computed(
  () => (
    console.warn('updated'),
    edgeIds
      .map<GraphEdge | undefined>(edge => {
        const source = vertices.find(v => v.id === edge.from)
        const target = vertices.find(v => v.id === edge.to)
        if (!source || !target) {
          console.error('source or target is missing')
          return
        }
        return { source, target, id: edge.id, type: edge.type }
      })
      .filter($defined)
  )
)

/**
 * Helper map object to associate newly created temporal node objects with the promises of their new ids.
 * This is primarly used when creating both new nodes and edge to wait for node ids to be resolved first.
 */
const newNodeIds = new WeakMap<GraphNode, Promise<number>>()

/**
 * Create a new graph node in sc-memory associated with the current workspace.\
 * Update the local state by pusing new node with its new sc-addr used as id to eliminate
 * delay of receiving an update from sc-memory. Save the node id promise in `newNodeIds`
 * in case it's a part of larger creation construction.
 * @param node GraphNode object with all information about new node
 */
const addNode = async (node: GraphNode) => {
  const newVertex = new Vertex({ x: node.x, y: node.y, customType: node.type, name: 'i', is: { elementVertex: slice } }).create
  const id = newVertex.then(v => v.ref.addr)
  newNodeIds.set(node, id)
  vertices.push({ label: 'i', type: node.type, x: node.x, y: node.y, id: await id })
}

/**
 * Create a new graph edge in sc-memory associated with the current workspace.\
 * Having source/target ids resolved preliminarily, update the local state by pusing new edge
 * with its new sc-addr used as id to eliminate delay of receiving an update from sc-memory.
 * @param node GraphEdge object with all information about new edge
 */
const addEdge = async (edge: GraphEdge) => {
  const from = typeof edge.source.id === 'number' ? edge.source.id : await newNodeIds.get(edge.source)!
  const to = typeof edge.target.id === 'number' ? edge.target.id : await newNodeIds.get(edge.target)!
  const newEdge = await new Edge({
    from: Vertex`${from}`,
    to: Vertex`${to}`,
    sc: ScType.EdgeDCommonVar,
    customType: edge.type,
    is: { elementEdge: slice },
  }).create
  edgeIds.push({ from, to, type: edge.type, id: newEdge.ref.addr })
}

/** Workspace store slice */
export const workspace = { vertices, edges, addNode, addEdge }
