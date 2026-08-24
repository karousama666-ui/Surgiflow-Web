import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importação dos Contextos (Os nossos "Cérebros")
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; // 👈 NOVO: Cérebro do Tema
import { CirurgiasProvider } from "./context/CirurgiasContext";
import { MedicosProvider } from "./context/MedicosContext";
import { PedidosProvider } from "./context/PedidosContext";
import { PacientesProvider } from "./context/PacientesContext"; 

// Importação do Segurança da Rota e Componentes Visuais
import RotaProtegida from "./components/RotaProtegida";
import Sidebar from "./components/layout/Sidebar"; 
import Header from "./components/layout/Header";  

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

// ==========================================
// O "MOLDE" DA PLATAFORMA (Menu, Topo e Fonte)
// ==========================================
const LayoutApp = ({ children }) => {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <div className="layout-app" style={{ 
            display: "flex", 
            width: "100vw", 
            height: "100vh", 
            overflow: "hidden", 
            fontFamily: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            <Sidebar isOpen={menuAberto} onClose={() => setMenuAberto(false)} />
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Header onMenuToggle={() => setMenuAberto(!menuAberto)} />
                <main className="main-content" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
  return (
    <ThemeProvider>
      {/* 👇 INJETAMOS AQUI AS REGRAS GLOBAIS DO DARK MODE (O TRATOR) 👇 */}
      <style>
        {`
          /* Estilos base (Light) */
          .layout-app { background: #f8fafc; }
          .main-content { background: #f1f5f9; }

          /* ========================================= */
          /* 🌙 MODO ESCURO (DARK MODE) 🌙             */
          /* ========================================= */
          body.dark-mode {
            background-color: #0f172a !important; 
            color: #f8fafc !important; 
          }
          body.dark-mode .layout-app { background: #0f172a !important; }
          body.dark-mode .main-content { background: #0f172a !important; }

          /* 🚜 O TRATOR: Força TUDO que for card, tabela ou lista a ficar escuro */
          body.dark-mode table,
          body.dark-mode th,
          body.dark-mode td,
          body.dark-mode tr,
          body.dark-mode tbody,
          body.dark-mode thead,
          body.dark-mode ul,
          body.dark-mode li {
            background-color: #1e293b !important;
            border-color: #334155 !important;
            color: #f8fafc !important;
          }

          /* Captura os fundos brancos colocados via style inline (Cards do Kanban e Lembretes) */
          body.dark-mode div[style*="background: #fff"], 
          body.dark-mode div[style*="background: rgb(255, 255, 255)"],
          body.dark-mode div[style*="background-color: #fff"],
          body.dark-mode div[style*="background-color: rgb(255, 255, 255)"],
          body.dark-mode div[style*="background: white"],
          body.dark-mode div[style*="background-color: white"] {
            background-color: #1e293b !important; 
            border-color: #334155 !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3) !important; /* Dá uma sombra mais escura */
          }

          /* Ajusta os textos genéricos para claro */
          body.dark-mode h1,
          body.dark-mode h2,
          body.dark-mode h3,
          body.dark-mode h4,
          body.dark-mode p,
          body.dark-mode label,
          body.dark-mode strong {
            color: #f8fafc !important;
          }

          /* Ajusta textos dentro de DIVs e SPANs que possam estar escuros */
          /* Ignora botões coloridos para não estragar o design deles */
          body.dark-mode div:not([style*="background: #6C63FF"]), 
          body.dark-mode span:not([style*="color: #10b981"]):not([style*="color: #ef4444"]) { 
            color: #e2e8f0;
          }

          /* Textos secundários (ex: CRM, datas, hospital) viram um cinza legível */
          body.dark-mode p[style*="color: #64748b"],
          body.dark-mode span[style*="color: #64748b"],
          body.dark-mode div[style*="color: #64748b"],
          body.dark-mode span[style*="color: #94a3b8"] {
            color: #94a3b8 !important;
          }

          /* Campos de Input, Select e Textarea no escuro */
          body.dark-mode input,
          body.dark-mode select,
          body.dark-mode textarea {
            background-color: #0f172a !important;
            color: #f8fafc !important;
            border-color: #334155 !important;
          }

          /* Sidebar e Header no escuro */
          body.dark-mode .sidebar, body.dark-mode header {
            background-color: #1e293b !important;
            border-color: #334155 !important;
          }
        `}
      </style>

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
                </Routes>

                </PacientesProvider>
              </PedidosProvider>
            </MedicosProvider>
          </CirurgiasProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;