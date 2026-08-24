import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importação dos Contextos (Os nossos "Cérebros")
import { AuthProvider } from "./context/AuthContext";
import { CirurgiasProvider } from "./context/CirurgiasContext";
import { MedicosProvider } from "./context/MedicosContext";
import { PedidosProvider } from "./context/PedidosContext";
import { PacientesProvider } from "./context/PacientesContext"; 

// Importação do Segurança da Rota e Componentes Visuais
import RotaProtegida from "./components/RotaProtegida";
import Sidebar from "./components/layout/Sidebar"; 
import Header from "./components/layout/Header";  
import ChatbotFAQ from "./components/layout/ChatbotFAQ"; 

// ==========================================
// IMPORTAÇÃO DE TODAS AS TELAS DO SISTEMA
// ==========================================
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NovaSenha from "./pages/NovaSenha"; 
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Calendario from "./pages/Calendario";
import Pacientes from "./pages/Pacientes"; 
import Medicos from "./pages/Medicos";
import Pedidos from "./pages/Pedidos";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Chat from "./pages/Chat"; // 👈 NOVO: Importação da Tela de Chat!

// ==========================================
// O "MOLDE" DA PLATAFORMA (Menu, Topo e Fonte)
// ==========================================
const LayoutApp = ({ children }) => {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <div style={{ 
            display: "flex", 
            width: "100vw", 
            height: "100vh", 
            overflow: "hidden", 
            fontFamily: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            background: "#f8fafc" 
        }}>
            <Sidebar isOpen={menuAberto} onClose={() => setMenuAberto(false)} />
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
                <Header onMenuToggle={() => setMenuAberto(!menuAberto)} />
                <main style={{ flex: 1, overflowY: "auto", padding: "24px", background: "#f1f5f9" }}>
                    {children}
                </main>
                
                {/* O Chatbot flutuante renderizado aqui */}
                <ChatbotFAQ />
            </div>
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CirurgiasProvider>
          <MedicosProvider>
            <PedidosProvider>
              <PacientesProvider> 
              
              <Routes>
                {/* 🔴 ROTAS PÚBLICAS (Telas Cheias) */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/nova-senha" element={<NovaSenha />} />

                {/* 🟢 ROTAS PROTEGIDAS (Com o Molde Aplicado) */}
                <Route path="/dashboard" element={<RotaProtegida><LayoutApp><Dashboard /></LayoutApp></RotaProtegida>} />
                <Route path="/agenda" element={<RotaProtegida><LayoutApp><Agenda /></LayoutApp></RotaProtegida>} />
                <Route path="/calendario" element={<RotaProtegida><LayoutApp><Calendario /></LayoutApp></RotaProtegida>} />
                <Route path="/pacientes" element={<RotaProtegida><LayoutApp><Pacientes /></LayoutApp></RotaProtegida>} />
                <Route path="/medicos" element={<RotaProtegida><LayoutApp><Medicos /></LayoutApp></RotaProtegida>} />
                <Route path="/pedidos" element={<RotaProtegida><LayoutApp><Pedidos /></LayoutApp></RotaProtegida>} />
                <Route path="/relatorios" element={<RotaProtegida><LayoutApp><Relatorios /></LayoutApp></RotaProtegida>} />
                <Route path="/configuracoes" element={<RotaProtegida><LayoutApp><Configuracoes /></LayoutApp></RotaProtegida>} />
                
                {/* 👈 NOVA ROTA DE CHAT AQUI 👇 */}
                <Route path="/chat" element={<RotaProtegida><LayoutApp><Chat /></LayoutApp></RotaProtegida>} />
              </Routes>

              </PacientesProvider>
            </PedidosProvider>
          </MedicosProvider>
        </CirurgiasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;