import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Importando os Contextos (Nossos "Cérebros")
import { AuthProvider } from "./context/AuthContext";
import { MedicosProvider } from "./context/MedicosContext";
import { CirurgiasProvider } from "./context/CirurgiasContext";
import { PedidosProvider } from "./context/PedidosContext";

// 2. Importando as Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Calendario from "./pages/Calendario";
import Medicos from "./pages/Medicos";
import Pedidos from "./pages/Pedidos";
import Relatorios from "./pages/Relatorios"; // <-- Adicionado!
import Configuracoes from "./pages/Configuracoes"; // <-- Adicionado!

// 3. Importando a Proteção de Rota e Layout
import RotaProtegida from "./components/RotaProtegida";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MedicosProvider>
          <CirurgiasProvider>
            <PedidosProvider> 
              
              <Routes>
                {/* Rota Pública (Tela de Login) */}
                <Route path="/" element={<Login />} />

                {/* Rotas Privadas (Dentro do SurgiFlow) */}
                <Route
                  path="/*"
                  element={
                    <RotaProtegida>
                      <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc" }}>
                        <Sidebar />
                        
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                          <Header />
                          
                          {/* CORREÇÃO DO LAYOUT: padding de 30px devolve o respiro da tela! */}
                          <main style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/agenda" element={<Agenda />} />
                              <Route path="/calendario" element={<Calendario />} />
                              <Route path="/medicos" element={<Medicos />} />
                              <Route path="/pedidos" element={<Pedidos />} />
                              
                              {/* CORREÇÃO DAS TELAS VAZIAS: Rotas adicionadas de volta! */}
                              <Route path="/relatorios" element={<Relatorios />} />
                              <Route path="/configuracoes" element={<Configuracoes />} />
                            </Routes>
                          </main>
                        </div>
                      </div>
                    </RotaProtegida>
                  }
                />
              </Routes>

            </PedidosProvider>
          </CirurgiasProvider>
        </MedicosProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;