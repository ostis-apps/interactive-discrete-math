import { EdgeType, NodeType } from '@ennealand/enigraph'
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
    type: NodeType
    name: string
  }
  Edge: {
    from: 'Vertex'
    to: 'Vertex'
    type: EdgeType
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
