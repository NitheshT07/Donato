import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import FarmDashboard from './pages/FarmDashboard';
import MyDonations from './pages/MyDonations';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Settings from './pages/Settings';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  const roles = ['donor', 'ngo', 'farm'];

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Main Dashboards */}
        <Route path="/donor" element={<ProtectedRoute allowedRole="donor"><DonorDashboard /></ProtectedRoute>} />
        <Route path="/ngo" element={<ProtectedRoute allowedRole="ngo"><NGODashboard /></ProtectedRoute>} />
        <Route path="/farm" element={<ProtectedRoute allowedRole="farm"><FarmDashboard /></ProtectedRoute>} />

        {/* Dynamic Sub-pages for all roles */}
        {roles.map(role => (
          <Route key={role} path={`/${role}`}>
            <Route 
              path="items" 
              element={
                <ProtectedRoute allowedRole={role}>
                  <MyDonations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="analytics" 
              element={
                <ProtectedRoute allowedRole={role}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="community" 
              element={
                <ProtectedRoute allowedRole={role}>
                  <Community />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute allowedRole={role}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Route>
        ))}

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
