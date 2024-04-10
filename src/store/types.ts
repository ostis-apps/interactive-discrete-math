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
  AppWorkspace: {
    elementVertex: 'Vertex'
    elementEdge: 'Edge'
    elementGroup: 'Group'
  }

  ElementVertex: {
    x: number
    y: number
  }

  ElementEdge: {
    source: 'ElementVertex'
    target: 'ElementVertex'
  }

  ElementGroup: {
    elements: 'SetOfElementVertices'
    to: 'AnotherGroup'
  }

  SetOfElementVertices: {
    element: 'ElementVertex'
  }

  Vertex: {
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
  AnotherGroup: {
    element_vertex: 'AnotherVertex'
    sc: ScType.NodeVarStruct
  }
  AnotherVertex: {
    customType: NodeType
    name: string
    sc: ScType
  }
  Group: {
    element_vertex: 'Vertex'
    element_oredge: 'Edge'
    sc: ScType.NodeVarStruct
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

  AgentType: {
    element: 'Question'
  }

  Question: {
    element: 'Runner'
    answer: 'Answer'
  }

  Answer: {
    element_1: 'Group'
  }

  Runner: {
    name: string
    element_1: 'Group' | 'AnotherGroup'
    element_2: 'Group' | 'AnotherGroup'
    element_3: 'AgentArg'
  }
}
