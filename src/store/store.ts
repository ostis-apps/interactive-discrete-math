import { useStoreFactory } from './factory'

import { workspaceSlice } from './slices/workspace'

export const { StoreContext, useCreateStore, useStore } = useStoreFactory({
  workspace: workspaceSlice,
})

export const useWorkspace = () => useStore().workspace

export {} from './slices/workspace'
