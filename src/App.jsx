import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import ContractorDetails from './pages/ContractorDetails'

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/report" element={<ReportIssue />} />

        <Route path="/contractors" element={<ContractorDetails />} />
      </Routes>

    </BrowserRouter>
  )
}