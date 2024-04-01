import { useStoreFactory } from './factory'
import { navigationSlice } from './navigation'
import { workspaceSlice } from './workspace'

export const { StoreContext, useCreateStore, useStore } = useStoreFactory({
  navigation: navigationSlice,
  workspace: workspaceSlice,
})

export const useNavigation = () => useStore().navigation
export const useWorkspace = () => useStore().workspace

export { View } from './navigation'
export {} from './workspace'
