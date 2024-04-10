import { EdgeType, Graph, GraphElements } from '@ennealand/enigraph'
import { useSignal } from '@preact/signals'
import { DeepSignal, deepSignal } from 'deepsignal'
import { useEffect } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { workspace } from '../../store/slices/workspace'
import { workspaceToolsSlice } from '../../store/slices/workspace-tools'

type Props = {
  w: number
  h: number
} & JSX.HTMLAttributes<HTMLDivElement>

export const GraphComponent = ({ w, h, ...props }: Props) => {
  const elements = useSignal<DeepSignal<GraphElements> | undefined>(undefined)

  useEffect(() => {
    const effect = async () => {
      elements.value = deepSignal({ nodes: [], edges: [], groups: [] })
      // elements.value.$nodes!.value = workspace.vertices.map(v => ({ ...v, x: 0, y: 0 }))
      // elements.value.edges = workspace.edges.value.map(e => ({ ...e, source: { ...e.source, x: 0, y: 0 }, target: { ...e.target, x: 0, y: 0 } }))
      // setTimeout(() => {
      elements.value.$edges = workspace.edges
      elements.value.$groups = workspace.groups
      elements.value.$nodes!.value = workspace.vertices
      // }, 20);
    }
    effect()
  }, [])

  return (
    <div {...props} style={{ minWidth: w || 'calc(100% - 360px)', minHeight: h || '100%' }}>
      {elements.value ? (
        <Graph
          elements={elements.value}
          addNode={workspace.addNode}
          addEdge={workspace.addEdge}
          addGroup={workspace.addGroup}
          changeNodeLabel={workspace.changeNodeLabel}
          width={w}
          height={h}
          padding={15}
          edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst, EdgeType.ArcConstPermPosAccess]}
          objectSelection={workspaceToolsSlice.groupSelection}
          changeNodePosition={workspace.changeNodePosition}
          removeNode={workspace.removeNode}
        />
      ) : (
        <div style={{ width: w, height: h }}></div>
      )}
    </div>
  )
}
