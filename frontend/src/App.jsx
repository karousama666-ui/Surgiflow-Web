import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// 1. IMPORTANDO OS SEUS CONTEXTOS
import { CirurgiasProvider } from './context/CirurgiasContext'; 
import { MedicosProvider } from './context/MedicosContext'; 

// 2. COMPONENTES DE LAYOUT
import Sidebar from './components/layout/Sidebar'; 

// 3. PÁGINAS OFICIAIS
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda'; 
import Calendario from './pages/Calendario';
import Medicos from './pages/Medicos';
import Pedidos from './pages/Pedidos';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';

// 4. ESTRUTURA VISUAL COM SCROLL CORRIGIDO
const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginScreen = location.pathname === '/';
  
  if (isLoginScreen) {
    return <>{children}</>; 
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh' }}>
        {children}
      </div>
    </div>
  );
};

// 5. APLICATIVO PRINCIPAL
function App() {
  return (
    <CirurgiasProvider>
      <MedicosProvider>
        <BrowserRouter basename="/Surgiflow-Web">
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MedicosProvider>
    </CirurgiasProvider>
  );
}

export default App;