import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importação dos Contextos (Os nossos "Cérebros")
import { AuthProvider } from "./context/AuthContext";
import { CirurgiasProvider } from "./context/CirurgiasContext";
import { MedicosProvider } from "./context/MedicosContext";
import { PedidosProvider } from "./context/PedidosContext";

// Importação do Segurança da Rota e Componentes Visuais
import RotaProtegida from "./components/RotaProtegida";
import Sidebar from "./components/layout/Sidebar"; 
import Header from "./components/layout/Header";   

// ==========================================
// IMPORTAÇÃO DE TODAS AS TELAS DO SISTEMA
// ==========================================
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Calendario from "./pages/Calendario";
import Medicos from "./pages/Medicos";
import Pedidos from "./pages/Pedidos";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";

// ==========================================
// O "MOLDE" DA PLATAFORMA (Menu, Topo e Fonte)
// ==========================================
const LayoutApp = ({ children }) => {
    return (
        <div style={{ 
            display: "flex", 
            width: "100vw", 
            height: "100vh", 
            overflow: "hidden", 
            fontFamily: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            background: "#f8fafc" 
        }}>
            {/* Menu Lateral */}
            <Sidebar />
            
            {/* Painel Direito */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Header />
                <main style={{ flex: 1, overflowY: "auto", padding: "24px", background: "#f1f5f9" }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
  return (
    <BrowserRouter basename="/Surgiflow-Web">
      <AuthProvider>
        <CirurgiasProvider>
          <MedicosProvider>
            <PedidosProvider>
              
              <Routes>
                {/* 🔴 ROTAS PÚBLICAS (Telas Cheias) */}
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />

                {/* 🟢 ROTAS PROTEGIDAS (Com o Molde Aplicado) */}
                <Route path="/dashboard" element={<RotaProtegida><LayoutApp><Dashboard /></LayoutApp></RotaProtegida>} />
                <Route path="/agenda" element={<RotaProtegida><LayoutApp><Agenda /></LayoutApp></RotaProtegida>} />
                <Route path="/calendario" element={<RotaProtegida><LayoutApp><Calendario /></LayoutApp></RotaProtegida>} />
                <Route path="/medicos" element={<RotaProtegida><LayoutApp><Medicos /></LayoutApp></RotaProtegida>} />
                <Route path="/pedidos" element={<RotaProtegida><LayoutApp><Pedidos /></LayoutApp></RotaProtegida>} />
                <Route path="/relatorios" element={<RotaProtegida><LayoutApp><Relatorios /></LayoutApp></RotaProtegida>} />
                <Route path="/configuracoes" element={<RotaProtegida><LayoutApp><Configuracoes /></LayoutApp></RotaProtegida>} />
                
              </Routes>

            </PedidosProvider>
          </MedicosProvider>
        </CirurgiasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;