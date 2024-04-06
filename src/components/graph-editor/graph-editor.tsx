import { EdgeType, Graph, GraphElements, GraphGroup } from '@ennealand/enigraph'
import { useSignal } from '@preact/signals'
import { DeepSignal, deepSignal } from 'deepsignal'
import { useEffect } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { workspace } from '../../store/slices/workspace'
// import WorkerScript from './force-worker?raw'

type Props = {
  w: number
  h: number
} & JSX.HTMLAttributes<HTMLDivElement>

export const GraphComponent = ({ w, h, ...props }: Props) => {
  const elements = useSignal<DeepSignal<GraphElements> | undefined>(undefined)

  useEffect(() => {
    const effect = async () => {
      elements.value = deepSignal({ nodes: [], edges: [], groups: [] })
      elements.value.$nodes!.value = workspace.vertices
      elements.value.$edges = workspace.edges
      console.log(workspace.edges.value)
    }
    effect()
  }, [])

  // const addNode = async (node: GraphNode) => {
  //   // elements.value?.nodes.push(node)
  //   const newn = await new Vertex({ name: 'D', type: node.type, x: node.x, y: node.y }).create
  //   console.log(newn.ref.addr)
  //   console.log('umm')
  // }

  const addGroup = (group: GraphGroup) => {
    if (!elements.value) return
    elements.value.groups.push(deepSignal(group))
    elements.value.groups = [...elements.value.groups]
    elements.value = { ...elements.value }
  }

  return (
    <div {...props} style={{ minWidth: w || 'calc(100% - 360px)', minHeight: h || '100%' }}>
      {elements.value ? (
        <Graph
          elements={elements.value}
          addNode={workspace.addNode.bind(workspace)}
          addEdge={workspace.addEdge.bind(workspace)}
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
