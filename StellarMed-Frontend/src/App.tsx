import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage'
import CreatePassport from './pages/createPassport'
import ViewPassport from './pages/viewPassport'
import AdminDashboard from './pages/adminView'
// import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/createPassport" element={<CreatePassport/>} />
      <Route path="/viewPassport" element={<ViewPassport />} />
      <Route path="/admin/Dashboard" element={<AdminDashboard />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default App