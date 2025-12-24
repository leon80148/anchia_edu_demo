import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calculators from './pages/Calculators';
import NHIQuery from './pages/NHIQuery';
import Guidelines from './pages/Guidelines';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/nhi-query" element={<NHIQuery />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
