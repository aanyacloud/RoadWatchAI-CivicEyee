import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

/* PAGES */
import Home from './pages/Home'
import UserHome from './pages/UserHome'
import ReportIssue from './pages/ReportIssue'
import AuthorityLogin from './pages/AuthorityLogin'
import AuthorityDashboard from './pages/AuthorityDashboard'
import MyComplaints from './pages/MyComplaints'
import RoadMap from './pages/RoadMap'
import ContractorDetails from './pages/ContractorDetails'

/* AI CHAT */
import FloatingChat from './components/FloatingChat'

export default function App() {

  return (

    <Router>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* USER HOME */}
        <Route
          path="/user-home"
          element={<UserHome />}
        />

        {/* REPORT ISSUE */}
        <Route
          path="/report"
          element={<ReportIssue />}
        />

        {/* AUTHORITY LOGIN */}
        <Route
          path="/authority-login"
          element={<AuthorityLogin />}
        />

        {/* AUTHORITY DASHBOARD */}
        <Route
          path="/authority"
          element={<AuthorityDashboard />}
        />

        {/* MY COMPLAINTS */}
        <Route
          path="/my-complaints"
          element={<MyComplaints />}
        />

        {/* ROAD MAP */}
        <Route
          path="/road-map"
          element={<RoadMap />}
        />

        {/* CONTRACTOR DETAILS */}
        <Route
          path="/contractors"
          element={<ContractorDetails />}
        />

      </Routes>

      {/* FLOATING AI CHATBOT */}
      <FloatingChat />

    </Router>

  )

}