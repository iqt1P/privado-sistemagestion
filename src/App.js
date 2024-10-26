// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Perfil';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Tasks from './pages/Tasks';
import RegistroPruebas from './pages/RegistroPruebas';
import GenerateReports from "./pages/GenerateReports";
import PrivateRoute from './PrivateRoute';


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de inicio */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Páginas principales */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/generar-reportes" element={<PrivateRoute><GenerateReports /></PrivateRoute>} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/registro-pruebas" element={<RegistroPruebas />} />

        {/* Redirigir rutas no encontradas al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
