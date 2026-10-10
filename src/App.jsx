import React from 'react';
import { Routes, Route } from 'react-router-dom';


import AdminLoginPage from './pages/login.jsx'; 


import { RegistrationForm } from './components/RegistrationForm.jsx';
import VerificationDashboard from './pages/VerificationDashboard.jsx';

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<AdminLoginPage />} />
      
    
      <Route path="/admin" element={<RegistrationForm />} />
      <Route path="/admin/verification" element={<VerificationDashboard />} />
      
      
      <Route path="*" element={<AdminLoginPage />} />
    </Routes>
  );
}

export default App;