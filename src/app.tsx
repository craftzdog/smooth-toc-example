import './app.css'
import { Container } from './atoms/container'
import { MainContent } from './components/main-content'
import { MarkdownView } from './components/markdown-view'

function App() {
  return (
    <Container>
      <MainContent>
        <MarkdownView />
      </MainContent>
    </Container>
  )
}

export default App
