import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase"; 
import { useAuth } from "../../context/AuthContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Puxa o usuário atual logado
  
  // Estados para as notificações e perfil
  const [notificacoes, setNotificacoes] = useState([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [cargoUsuario, setCargoUsuario] = useState("Carregando...");

  // Busca Notificações e Perfil ao carregar a tela
  useEffect(() => {
    async function buscarDadosGlobais() {
      // 1. Busca as notificações não lidas
      const { data: dadosNotif, error: erroNotif } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('lida', false)
        .order('created_at', { ascending: false });

      if (!erroNotif && dadosNotif) {
        setNotificacoes(dadosNotif);
      }

      // 2. Busca o nome real na tabela "perfis"
      if (user?.id) {
        const { data: dadosPerfil, error: erroPerfil } = await supabase
          .from('perfis')
          .select('nome, cargo')
          .eq('id', user.id)
          .single();

        if (!erroPerfil && dadosPerfil) {
          setNomeUsuario(dadosPerfil.nome);
          setCargoUsuario(dadosPerfil.cargo || "Biomédica");
        } else {
          // Caso a tabela perfil ainda não tenha o dado, usa esse fallback elegante
          setNomeUsuario("Carolina Ramos"); 
          setCargoUsuario("Biomédica");
        }
      }
    }
    
    buscarDadosGlobais();
  }, [user]);

  // Pega a primeira letra do nome para o Avatar
  const inicial = nomeUsuario !== "Carregando..." ? nomeUsuario.charAt(0).toUpperCase() : "C";

  // Função para deslogar
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  // Função para marcar uma notificação como lida
  const marcarComoLida = async (id) => {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    setNotificacoes(notificacoes.filter(notif => notif.id !== id)); // Remove da tela na mesma hora
  };

  // Identifica a página atual pela URL para o Breadcrumb
  const titulos = {
    "/dashboard": "Painel de Controle",
    "/agenda": "Agenda de Cirurgias",
    "/medicos": "Corpo Clínico",
    "/calendario": "Calendário",
    "/pedidos": "Pedidos Cirúrgicos",
    "/relatorios": "Relatórios",
    "/configuracoes": "Configurações do Sistema"
  };
  const tituloAtual = titulos[location.pathname] || "SurgiFlow";

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "70px", minHeight: "70px", padding: "0 30px",
      backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 2px rgba(0,0,0,0.02)", position: "relative"
    }}>
      
      {/* LADO ESQUERDO: Caminho da Tela (Breadcrumb) */}
      <div style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>
        Menu Principal <span style={{ margin: "0 8px", color: "#cbd5e1" }}>/</span> 
        <span style={{ color: "#1e293b", fontWeight: "600" }}>{tituloAtual}</span>
      </div>

      {/* LADO DIREITO: Notificações, Perfil e Sair */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        
        {/* Status Online */}
        <div style={{ 
          fontSize: "0.75rem", color: "#059669", background: "#d1fae5", 
          padding: "4px 10px", borderRadius: "20px", fontWeight: "600",
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          <span style={{ width: "6px", height: "6px", backgroundColor: "#059669", borderRadius: "50%", display: "inline-block" }}></span>
          Online
        </div>

        {/* Ícone de Notificações com Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
            style={{ 
              background: "none", border: "none", cursor: "pointer", 
              display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b"
            }} 
            title="Notificações"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            
            {/* Bolinha vermelha só aparece se tiver notificação */}
            {notificacoes.length > 0 && (
              <span style={{
                position: "absolute", top: "0", right: "2px", width: "8px", height: "8px",
                backgroundColor: "#ef4444", borderRadius: "50%", border: "2px solid #fff"
              }}></span>
            )}
          </button>

          {/* CAIXA FLUTUANTE DE NOTIFICAÇÕES */}
          {mostrarNotificacoes && (
            <div style={{
              position: "absolute", top: "40px", right: "-50px", width: "300px",
              backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 1000, overflow: "hidden"
            }}>
              <div style={{ padding: "12px 15px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontWeight: "600", color: "#1e293b", fontSize: "0.9rem" }}>
                Notificações ({notificacoes.length})
              </div>
              
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {notificacoes.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                    Nenhuma notificação nova.
                  </div>
                ) : (
                  notificacoes.map((notif) => (
                    <div key={notif.id} style={{ padding: "12px 15px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: "600", fontSize: "0.85rem", color: "#0f172a" }}>{notif.titulo}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>{notif.mensagem}</div>
                      <button 
                        onClick={() => marcarComoLida(notif.id)}
                        style={{ marginTop: "8px", fontSize: "0.75rem", color: "#4f46e5", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: "500" }}
                      >
                        Marcar como lida
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divisor vertical */}
        <div style={{ height: "30px", width: "1px", backgroundColor: "#e2e8f0" }}></div>

        {/* ÁREA DO USUÁRIO (Adeus e-mail otaku!) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>{nomeUsuario}</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>{cargoUsuario}</p>
          </div>
          {/* Avatar Dinâmico com a inicial do nome */}
          <div style={{ 
            width: "38px", height: "38px", borderRadius: "50%", 
            backgroundColor: "#4f46e5", color: "#ffffff", 
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: "1.1rem"
          }}>
            {inicial}
          </div>
        </div>

        {/* Botão de Sair */}
        <button 
          onClick={handleLogout}
          style={{ 
            display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid #e2e8f0", 
            padding: "8px 14px", borderRadius: "8px", cursor: "pointer", color: "#ef4444", fontWeight: "500", fontSize: "0.85rem",
          }}
        >
          Sair
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

      </div>
    </header>
  );
}

export default Header;