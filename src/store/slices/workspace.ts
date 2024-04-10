import { EdgeType, GraphEdge, GraphGroup, GraphNode, NodeType } from '@ennealand/enigraph'
import { ScType, deepSignal } from '@ennealand/enneract'
import { computed } from '@preact/signals'
import { AppWorkspace, Edge, ElementEdge, ElementGroup, ElementVertex, Group, SetOfElementVertices, Vertex } from '../core.ts'
import { $defined } from '../store.ts'

const slice = (await AppWorkspace`example`.ref.one)!

type GraphNodeExtended = GraphNode & { addr: number }
type GraphEdgeExtended = GraphEdge & {
  source: GraphNodeExtended
  target: GraphNodeExtended
}

// Reset the workspace state:
// await import('../reset.ts').then(mod => mod.resetWorkspace())

/**
 * Array of verices data in the workspace
 */
const vertices = await slice.elementVertex.get({
  relation: { x: 'x', y: 'y', ref: { addr: 'id' } },
  ref: { addr: 'addr' },
  customType: 'type',
  name: 'label',
}).reactive

/**
 * Array of edges data in the workspace
 */
const edgeIds = await slice.elementEdge.get({
  relation: { source: { ref: { addr: 'source' } }, target: { ref: { addr: 'target' } }, ref: { addr: 'id' } },
  from: { ref: { addr: 'from' } },
  to: { ref: { addr: 'to' } },
  customType: 'type',
  ref: { addr: 'addr' },
}).reactive

/**
 * Array of edges data in the workspace with sources and targets mapped to reactive vertices
 */
const edges = computed(() =>
  edgeIds
    .map<GraphEdgeExtended | undefined>(edge => {
      const source = vertices.find(v => v.id === edge.source)
      const target = vertices.find(v => v.id === edge.target)
      if (!source || !target) {
        // console.log({ ...edge }, vertices.map(_ => ({ ..._ })))
        // console.error('source or target is missing')
        return
      }
      return { source, target, id: edge.id, type: edge.type }
    })
    .filter($defined)
)

/**
 * Array of groups data in the workspace
 */
const groupsArray = await slice.elementGroup.get({
  ref: { addr: 'addr' },
  relation: { ref: { addr: 'id' }, elements: { element: { ref: { addr: 'element' } } } },
}).reactive
const groups = computed(() => {
  const result = new Map<number, GraphGroup>()
  for (const group of groupsArray) {
    let existing = result.get(group.id)
    if (!existing)
      result.set(group.id, (existing = { id: group.id, label: '', values: new Set(), position: { bottom: 0, left: 0, right: 0, top: 0 } }))
    existing.values.add(group.element)
  }
  // console.logMediumSeaGreen('groups:', result)
  return deepSignal(Array.from(result.values()))
})

/**
 * Helper map object to associate newly created temporal node objects with the promises of their new ids.
 * This is primarly used when creating both new nodes and edge to wait for node ids to be resolved first.
 */
const newNodeIds = new WeakMap<GraphNode, { addr: Promise<number>; id: Promise<number> }>()

/**
 * Create a new graph node in sc-memory associated with the current workspace.\
 * Update the local state by pusing new node with its new sc-addr used as id to eliminate
 * delay of receiving an update from sc-memory. Save the node id promise in `newNodeIds`
 * in case it's a part of larger creation construction.
 * @param node GraphNode object with all information about new node
 */
const addNode = async (node: GraphNode) => {
  const newVertex = new Vertex({
    customType: node.type,
    name: 'i',
    is: { elementVertex: { value: slice, relation: { x: node.x, y: node.y } } },
  }).create
  const id = newVertex.then(v => v.relations[0])
  const addr = newVertex.then(v => v.ref.addr)
  newNodeIds.set(node, { id, addr })
  vertices.push({ label: 'i', type: node.type, x: node.x, y: node.y, id: await id, addr: await addr })
}

/**
 * Create a new graph edge in sc-memory associated with the current workspace.\
 * Having source/target ids resolved preliminarily, update the local state by pusing new edge
 * with its new sc-addr used as id to eliminate delay of receiving an update from sc-memory.
 * @param node GraphEdge object with all information about new edge
 */
const addEdge = async (edge: GraphEdgeExtended) => {
  const from = edge.source.addr || (await newNodeIds.get(edge.source)!.addr)
  const to = edge.target.addr || (await newNodeIds.get(edge.target)!.addr)
  const source = edge.source.id || (await newNodeIds.get(edge.source)!.id)
  const target = edge.target.id || (await newNodeIds.get(edge.target)!.id)
  await smartAddEdge({ from, to, source, target, type: edge.type })
}

const smartAddEdge = async (edge: { from: number; to: number; source: number; target: number; type: EdgeType }, root = edgeIds) => {
  // Check if the edge already exists and thus only its "view" should be added.
  const existingEdge = root.find(e => e.from === edge.from && e.to === edge.to && e.type === edge.type)
  if (existingEdge) {
    const relation = await slice.elementEdge.link(Edge`${existingEdge.addr}`, {
      source: ElementVertex`${edge.source}`,
      target: ElementVertex`${edge.target}`,
    })
    edgeIds.push({ ...edge, id: relation.ref.addr, addr: existingEdge.addr })
    root.push({ ...edge, id: relation.ref.addr, addr: existingEdge.addr })
    console.logMediumSeaGreen('Edge created:', `id ${relation.ref.addr}`)
    return
  }
  const newEdge = await new Edge({
    from: Vertex`${edge.from}`,
    to: Vertex`${edge.to}`,
    sc: ScType.EdgeDCommonVar,
    customType: edge.type,
    is: { elementEdge: { value: slice, relation: { source: ElementVertex`${edge.source}`, target: ElementVertex`${edge.target}` } } },
  }).create
  edgeIds.push({ ...edge, id: newEdge.relations[0], addr: newEdge.ref.addr })
  root.push({ ...edge, id: newEdge.relations[0], addr: newEdge.ref.addr })
  console.logMediumSeaGreen('Edge created:', `addr ${newEdge.ref.addr}`)
}

const smartDeleteEdge = async (edge: { addr: number; id: number }, root = edgeIds) => {
  const anotherEdge = root.some(e => e.addr === edge.addr && e.id !== edge.id)
  const edgeIndex = root.findIndex(e => e.id === edge.id)
  if (edgeIndex !== -1) root.splice(edgeIndex, 1)
  if (anotherEdge) await ElementEdge`${edge.id}`.ref.delete
  else await Edge`${edge.addr}`.ref.delete
  console.logDeepPink('Edge deleted:', anotherEdge ? `id ${edge.id}` : `addr ${edge.addr}`)
}

const smartAddVertex = async (
  vertex: { label: string; x: number; y: number; type: NodeType; id?: number; addr?: number },
  root = vertices
) => {
  const existingNode = root.find(v => v.label === vertex.label)
  if (existingNode) {
    const relation = await slice.elementVertex.link(Vertex`${existingNode.addr}`, { x: vertex.x, y: vertex.y })
    console.logMediumSeaGreen('Vertex created:', `id ${relation.ref.addr}`)
    return { ...vertex, id: relation.ref.addr, addr: existingNode.addr, type: existingNode.type }
  } else {
    const newVertex = await new Vertex({
      customType: vertex.type,
      name: vertex.label,
      sc: ScType.NodeVarClass,
      is: { elementVertex: { value: slice, relation: { x: vertex.x, y: vertex.y } } },
    }).create
    console.logMediumSeaGreen('Vertex created:', `addr ${vertex.addr}`)
    return { ...vertex, id: newVertex.relations[0], addr: newVertex.ref.addr }
  }
}

const smartDeleteVertex = async (node: { addr: number; id: number }, root = vertices) => {
  const anotherVertex = root.some(v => v.addr === node.addr && v.id !== node.id)
  if (anotherVertex) await ElementVertex`${node.id}`.ref.delete
  else await Vertex`${node.addr}`.ref.delete
  console.logDeepPink('Vertex deleted:', anotherVertex ? `id ${node.id}` : `addr ${node.addr}`)
}

/**
 * Create a new graph group in sc-memory associated with the current workspace.
 * Update the local state by pusing new group with its new sc-addr used as id to
 * eliminate delay of receiving an update from sc-memory.
 * @param node GraphGroup object with all information about new edge
 */
const addGroup = async (group: GraphGroup) => {
  const elements = await new SetOfElementVertices().create
  const newGroup = await new Group({ is: { elementGroup: { value: slice, relation: { elements } } } }).create
  for (const element of group.values) groupsArray.push({ addr: newGroup.ref.addr, id: newGroup.relations[0], element })
  await elements.element.link(Array.from(group.values).map(id => ElementVertex`${id}`))
  await newGroup.element_vertex.link(vertices.filter(vertex => group.values.has(vertex.id)).map(vertex => Vertex`${vertex.addr}}`))
}

/**
 * Change the node label to a new one in both sc-memory associated with the current workspace
 * and local state.
 * @param node GraphNode object the label belongs to
 * @param label The new label value
 */
const changeNodeLabel = async (reactiveNode: GraphNodeExtended, label: string) => {
  if (reactiveNode.label === label) return
  const untrackedVertices = vertices.map(_ => ({ ..._ })) as typeof vertices
  const untrackedEdgeIds = edgeIds.map(_ => ({ ..._ })) as typeof edgeIds
  const mutableUntrackedEdgeIds = edgeIds.map(_ => ({ ..._ })) as typeof edgeIds
  reactiveNode.label = label
  const node = { ...reactiveNode }
  const vertex = await smartAddVertex({ ...node, label }, untrackedVertices)
  reactiveNode.type = vertex.type
  for (const edge of untrackedEdgeIds) {
    if (edge.source === node.id) {
      await smartAddEdge(
        { from: vertex.addr, to: edge.to, source: vertex.id, target: edge.target, type: edge.type },
        mutableUntrackedEdgeIds
      )
      await smartDeleteEdge(edge, mutableUntrackedEdgeIds)
    }
    if (edge.target === node.id) {
      await smartAddEdge(
        { from: edge.from, to: vertex.addr, source: edge.source, target: vertex.id, type: edge.type },
        mutableUntrackedEdgeIds
      )
      await smartDeleteEdge(edge, mutableUntrackedEdgeIds)
    }
  }
  for (const group of groupsArray) {
    if (group.element === node.id) {
      Group`${group.addr}`.element_vertex.link(Vertex`${vertex.addr}`)
      Group`${group.addr}`.element_vertex.unlink(Vertex`${node.addr}`)
      ElementGroup`${group.id}`.elements.element.link(ElementVertex`${vertex.id}`)
      ElementGroup`${group.id}`.elements.element.unlink(ElementVertex`${node.id}`)
    }
  }
  smartDeleteVertex(node, untrackedVertices)
}

/**
 * Change the node position to a new one in both sc-memory associated with the current workspace
 * and local state.
 * @param node GraphNode object the label belongs to
 * @param x The new x-coordinate
 * @param y The new y-coordinate
 */
const changeNodePosition = async (node: GraphNode, x: number, y: number) => {
  node.x = x
  node.y = y
  console.log('fone')
  await ElementVertex`${node.id}`.x.write(x)
  await ElementVertex`${node.id}`.y.write(y)
}

/** Workspace store slice */
export const workspace = { vertices, edges, groups, addNode, addEdge, addGroup, changeNodeLabel, changeNodePosition }
