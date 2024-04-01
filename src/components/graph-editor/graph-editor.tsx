import { useSignal } from '@preact/signals'
import { DeepSignal, deepSignal } from 'deepsignal'
import { Graph, GraphEdge, GraphElements, GraphNode, GraphGroup, EdgeType } from '@ennealand/enigraph'
import { useLayoutEffect } from 'preact/hooks'
import { simulate } from './simulation'
import { JSX } from 'preact/jsx-runtime'
// import WorkerScript from './force-worker?raw'

type Props = {
  w: number
  h: number
} & JSX.HTMLAttributes<HTMLDivElement>

export const GraphComponent = ({ w, h, ...props }: Props) => {
  const elements = useSignal<DeepSignal<GraphElements> | undefined>(undefined)

  useLayoutEffect(() => {
    const effect = async () => {
      elements.value = (await import('../../../../preact-graph/src/dev/mockmin.json'))
        .default as unknown as GraphElements
      const data = simulate(elements.value, { animate: false })
      elements.value = deepSignal(data) as DeepSignal<GraphElements>
    }
    effect()
    // const worker = new Worker(URL.createObjectURL(new Blob([WorkerScript], { type: 'javascript/worker' })), {
    //   type: 'module',
    //   name: 'worker.mjs'
    // })
    // worker.postMessage(source)
    // worker.onmessage = (e: any) => (elements.value = deepSignal(e.data))
  }, [])

  const addNode = (node: GraphNode) => {
    elements.value?.nodes.push(node)
  }

  const addEdge = (edge: GraphEdge) => {
    if (edge.source !== edge.target) {
      elements.value?.edges.push(edge)
    }
  }

  const addGroup = (group: GraphGroup) => {
    if (!elements.value) return
    elements.value.groups.push(deepSignal(group))
    elements.value.groups = [...elements.value.groups]
    elements.value = { ...elements.value }
  }

  return (
    <div {...props}>
      <Graph
        elements={elements.value ?? { nodes: [], edges: [], groups: [] }}
        addNode={addNode}
        addEdge={addEdge}
        addGroup={addGroup}
        width={w}
        height={h}
        padding={15}
        edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst, EdgeType.ArcConstPermPosAccess]}
      />
    </div>
  )
}
