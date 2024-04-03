export interface App {
  AppView: {
    name: string
  }
  AppNavigationSlice: {
    current_view: 'AppView'
    current_addr: string
  }
  Graph: {
    rrelVertex: 'Vertex'
    rrelEdge: 'Edge'
  }
  Vertex: {
    coordinates: 'Coordinates'
  }
  Edge: {
    from: 'Vertex'
    to: 'Vertex'
  }
  Group: {
    element: 'Vertex'
    coordinates: 'Coordinates'
  }
  Coordinates: {
    x1: string
    y1: string
    x2: string
    y2: string
  }
}
