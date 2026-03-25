import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import PipelinePage from './pages/PipelinePage'
import ResumePage from './pages/ResumePage'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<HomePage />} />

          {/* Applications (renamed from Pipeline) */}
          <Route path="/applications" element={<PipelinePage />} />

          {/* Resume Page */}
          <Route path="/resume" element={<ResumePage />} />

          {/* Placeholder Pages */}
          <Route path="/insights" element={<PlaceholderPage title="Insights" />} />
          <Route path="/resources" element={<PlaceholderPage title="Resources" />} />

          {/* Analysis Pages */}
          <Route path="/analysis/:jobId" element={<AnalysisPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
