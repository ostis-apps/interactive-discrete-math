import { GraphEdge, GraphGroup, GraphNode } from '@ennealand/enigraph'
import { ScType, deepSignal } from '@ennealand/enneract'
import { computed } from '@preact/signals'
import { AppWorkspace, Edge, Group, Vertex } from '../core.ts'
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
 * Array of groups data in the workspace
 */
const groupsArray = await slice.elementGroup.get({ ref: { addr: 'id' }, element_vertex: { ref: { addr: 'element' } } }).reactive
const groups = computed(() => {
  const result = new Map<number, GraphGroup>()
  for (const group of groupsArray) {
    let existing = result.get(group.id)
    if (!existing)
      result.set(group.id, (existing = { id: group.id, label: '', values: new Set(), position: { bottom: 0, left: 0, right: 0, top: 0 } }))
    existing.values.add(group.element)
  }
  console.log('%cgroups:', 'color:seagreen', result)
  return deepSignal(Array.from(result.values()))
})

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

/**
 * Create a new graph group in sc-memory associated with the current workspace.
 * Update the local state by pusing new group with its new sc-addr used as id to
 * eliminate delay of receiving an update from sc-memory.
 * @param node GraphGroup object with all information about new edge
 */
const addGroup = async (group: GraphGroup) => {
  const newGroup = await new Group({ is: { elementGroup: slice }, sc: ScType.NodeVarStruct }).create
  for (const element of group.values) groupsArray.push({ id: newGroup.ref.addr, element })
  await newGroup.element_vertex.link(Array.from(group.values).map(id => Vertex`${id}`))
}

/**
 * Change the node label to a new one in both sc-memory associated with the current workspace
 * and local state.
 * @param node GraphNode object the label belongs to
 * @param label The new label value
 */
const changeNodeLabel = async (node: GraphNode, label: string) => {
  node.label = label
  await Vertex`${node.id}`.name.update(label)
}

/** Workspace store slice */
export const workspace = { vertices, edges, groups, addNode, addEdge, addGroup, changeNodeLabel }
