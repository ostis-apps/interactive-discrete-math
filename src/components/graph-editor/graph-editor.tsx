import { EdgeType, Graph, GraphEdge, GraphElements, GraphGroup, GraphNode } from '@ennealand/enigraph'
import { useSignal } from '@preact/signals'
import { DeepSignal, deepSignal } from 'deepsignal'
import { useEffect } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { simulate } from './simulation'
// import WorkerScript from './force-worker?raw'

type Props = {
  w: number
  h: number
} & JSX.HTMLAttributes<HTMLDivElement>

export const GraphComponent = ({ w, h, ...props }: Props) => {
  const elements = useSignal<DeepSignal<GraphElements> | undefined>(undefined)

  useEffect(() => {
    const effect = async () => {
      const mock = (await import('./mockmin.json')).default as unknown as GraphElements
      elements.value = deepSignal(structuredClone(mock))
      const data = simulate(mock, { animate: false })
      setTimeout(() => (elements.value = deepSignal(data) as DeepSignal<GraphElements>), 10)
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
      {elements.value ? (
        <Graph
          elements={elements.value}
          addNode={addNode}
          addEdge={addEdge}
          addGroup={addGroup}
          width={w}
          height={h}
          padding={15}
          edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst, EdgeType.ArcConstPermPosAccess]}
        />
      ) : (
        <div style={{ width: w, height: h }}></div>
      )}
    </div>
  )
}
