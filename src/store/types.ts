import { EdgeType, NodeType } from '@ennealand/enigraph'
import { ScType } from '@ennealand/enneract'
import { View } from './slices/navigation'

export interface App {
  AppView: {
    name: View
  }
  AppNavigationSlice: {
    current_view: 'AppView'
    current_addr: string
  }
  Graph: {
    rrelVertex: 'Vertex'
    rrelEdge: 'Edge'
  }

  AppWorkspace: {
    elementVertex: 'Vertex'
    elementEdge: 'Edge'
  }

  Vertex: {
    x: number
    y: number
    customType: NodeType
    name: string
  }
  Edge: {
    sc: ScType.EdgeUCommonVar | ScType.EdgeDCommonVar | ScType.EdgeAccessVarPosPerm
    from: 'Vertex'
    to: 'Vertex'
    customType: EdgeType
    name: string
  }
  Group: {
    element: 'Vertex'
    x1: string
    y1: string
    x2: string
    y2: string
  }
}
