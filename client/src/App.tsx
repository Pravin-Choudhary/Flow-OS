import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login-screen/LoginPage';
import DashboardPage from './components/dasboard/dashboard-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Private/Protected Dashboard Route */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Fallback to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
