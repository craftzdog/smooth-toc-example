import { create } from 'zustand'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { Container } from './atoms/container'
import { MainContent } from './components/main-content'
import { MarkdownView } from './components/markdown-view'

interface CounterState {
  count: number
  increment: () => void
}

const useCounterStore = create<CounterState>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}))

function App() {
  const { count, increment } = useCounterStore()

  return (
    <Container>
      <MainContent>
        <MarkdownView />
      </MainContent>
    </Container>
  )
}

export default App
