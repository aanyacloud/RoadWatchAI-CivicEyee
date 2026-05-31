import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
<<<<<<< HEAD
import ContractorDetails from './pages/ContractorDetails'
=======
>>>>>>> f6a98ec8f5f6ce3550d8d554cc80c698ab28e880

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/report" element={<ReportIssue />} />

<<<<<<< HEAD
        <Route path="/contractors" element={<ContractorDetails />} />

=======
>>>>>>> f6a98ec8f5f6ce3550d8d554cc80c698ab28e880
      </Routes>

    </BrowserRouter>
  )
}