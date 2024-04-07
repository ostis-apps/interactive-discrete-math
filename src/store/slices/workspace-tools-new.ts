import { AppWorkspaceTools } from '../core.ts'

const tools = await AppWorkspaceTools`default`.buttons.element.get({
  ref: true,
  name: true,
  icon: true,
  decomposition: {
    element: {
      name: true,
      agentArg: { ref: true },
      agentType: { ref: true },
    },
  },
})

console.log('tools', tools)
