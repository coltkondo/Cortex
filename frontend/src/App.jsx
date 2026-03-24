import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import PipelinePage from './pages/PipelinePage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis/:jobId" element={<AnalysisPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
