import './app.css'
import { Container } from './atoms/container'
import { MainContent } from './components/main-content'
import { MarkdownView } from './components/markdown-view'
import { PageTitle } from './components/page-title'

function App() {
  return (
    <Container>
      <MainContent>
        <PageTitle />
        <MarkdownView />
      </MainContent>
    </Container>
  )
}

export default App
