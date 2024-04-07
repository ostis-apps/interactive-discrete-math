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
    elementGroup: 'Group'
  }

  Vertex: {
    x: number
    y: number
    customType: NodeType
    name: string
    sc: ScType
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
  }

  AppWorkspaceTools: {
    buttons: 'SetOfButtons'
  }

  SetOfButtons: {
    element: 'Button'
  }

  Button: {
    name: string
    icon: string
    decomposition: 'SetOfActions'
  }

  SetOfActions: {
    element: 'Action'
  }

  Action: {
    name: string
    agentArg: 'AgentArg'
    agentType: 'AgentType'
  }

  AgentArg: {}

  AgentType: {}
}
