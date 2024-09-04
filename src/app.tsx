import { create } from 'zustand'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { Container } from './atoms/container'

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
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={increment}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Container>
  )
}

export default App
