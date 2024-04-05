import { useStoreFactory } from './factory'

import { workspaceToolsSlice } from './slices/workspace-tools'

export const { StoreContext, useCreateStore, useStore } = useStoreFactory({
  workspaceTools: workspaceToolsSlice,
})

export const useWorkspaceTools = () => useStore().workspaceTools

export {} from './slices/workspace-tools'

export const $defined = <_>(_: _ | undefined): _ is _ => _ !== undefined
