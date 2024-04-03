import { useStoreFactory } from './factory'

import { workspaceSlice } from './workspace'

export const { StoreContext, useCreateStore, useStore } = useStoreFactory({
  workspace: workspaceSlice,
})

export const useWorkspace = () => useStore().workspace

export {} from './workspace'
