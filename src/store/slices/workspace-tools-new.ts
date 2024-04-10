import { AppWorkspaceTools } from '../core';

AppWorkspaceTools






















// const buttonsResponse = await AppWorkspaceTools`default`.buttons.element.get({ ref: true, name: 'title', icon: true })
// const buttons = Object.fromEntries(buttonsResponse.map(button => [button.ref.ref.addr, { title: button.title, icon: button.icon }]))

// console.log('buttons', buttons)

// const acitionsResponse = await AppWorkspaceTools`default`.buttons.element.get({
//   ref: 'buttonRef',
//   decomposition: {
//     element: {
//       name: 'title',
//       agentArg: { ref: 'agentArg' },
//       agentType: { ref: 'agentType' },
//       ref: 'ref',
//     },
//   },
// })

// const actions = acitionsResponse.map(({ ref, ...action }) => [ref.ref.addr, action])
// console.log('actions', actions)
