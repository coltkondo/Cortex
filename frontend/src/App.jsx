import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ResumePage from './pages/ResumePage'
import InsightsPage from './pages/InsightsPage'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<HomePage />} />

          {/* Applications (renamed from Pipeline) */}
          <Route path="/applications" element={<ApplicationsPage />} />

          {/* Resume Page */}
          <Route path="/resume" element={<ResumePage />} />

          {/* Insights Page */}
          <Route path="/insights" element={<InsightsPage />} />

          {/* Placeholder Pages */}
          <Route path="/resources" element={<PlaceholderPage title="Resources" />} />

          {/* Analysis Pages */}
          <Route path="/analysis/:jobId" element={<AnalysisPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
