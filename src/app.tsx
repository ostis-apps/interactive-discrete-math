import { JSX } from 'preact/jsx-runtime'
import { Landing } from './components/landing/landing'
import { Playground } from './components/playground/playground'
import { TaskModule } from './components/task-module/task-module'
import { EmbeddedLayout } from './layouts/embedded'
import { StoreContext, useCreateStore } from './store/store'
import { navigation, View } from './store/slices/navigation'

const Views = {
  [View.Landing]: Landing,
  [View.KnowledgeBase]: Landing,
  [View.ConceptMap]: Landing,
  [View.TaskModule]: TaskModule,
  [View.Playground]: Playground,
} satisfies Record<View, () => JSX.Element>

export function App() {
  const store = useCreateStore()
  const CurrentView = Views[navigation.view.value]

  return (
    <StoreContext.Provider value={store}>
      <EmbeddedLayout full class='px-5 py-4'>
        <CurrentView />
      </EmbeddedLayout>
    </StoreContext.Provider>
  )
}
