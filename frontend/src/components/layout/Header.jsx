import { useState, useEffect, useRef } from "react"; 
import { useAuth } from "../../context/AuthContext";
import { useNotificacoes } from "../../context/NotificacoesContext"; // 👈 NOVO: O Cérebro das Notificações!
import { useLocation } from "react-router-dom";
import { Bell, LogOut, AlertCircle, PackageSearch, CheckCircle2, BellOff, Menu, Check } from "lucide-react";
import { supabase } from "../../services/supabase.js"; 

function Header({ onMenuToggle }) {
    const { logout } = useAuth(); 
    const location = useLocation();
    
    // 👇 Puxamos as notificações REAIS do banco de dados!
    const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();

    const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
    const notificacaoRef = useRef(null);
    
    const [nomeExibicao, setNomeExibicao] = useState("Carregando...");
    const [cargoExibicao, setCargoExibicao] = useState("Profissional de Saúde");
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

    useEffect(() => {
        async function buscarUsuarioLogado() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user && user.user_metadata) {
                    if (user.user_metadata.nome) {
                        const nomeCompleto = user.user_metadata.nome.split(" ");
                        const nomeCurto = `${nomeCompleto[0]} ${nomeCompleto[1] || ""}`;
                        setNomeExibicao(nomeCurto);
                    } else {
                        setNomeExibicao("Usuário");
                    }
                    
                    if (user.user_metadata.cargo) setCargoExibicao(user.user_metadata.cargo);
                    setNotificacoesAtivas(user.user_metadata.notificacoesSistema ?? true);
                }
            } catch (error) {
                console.error("Erro ao puxar dados do usuário:", error);
            }
        }
        buscarUsuarioLogado();
    }, []);

    // Fecha o menu de notificações se clicar fora dele
    useEffect(() => {
        function lidarComCliqueFora(event) {
            if (notificacaoRef.current && !notificacaoRef.current.contains(event.target)) {
                setNotificacoesAbertas(false);
            }
        }
        if (notificacoesAbertas) {
            document.addEventListener("mousedown", lidarComCliqueFora);
        } else {
            document.removeEventListener("mousedown", lidarComCliqueFora);
        }
        return () => document.removeEventListener("mousedown", lidarComCliqueFora);
    }, [notificacoesAbertas]);

    const formatarTitulo = () => {
        const path = location.pathname.replace("/", "");
        if (!path) return "Painel de Controle";
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    // Função auxiliar para tentar descobrir o ícone pela palavra-chave
    const descobrirIcone = (texto) => {
        const t = texto.toLowerCase();
        if (t.includes("opme")) return <PackageSearch size={18} color="#f59e0b" style={{ flexShrink: 0 }} />;
        return <AlertCircle size={18} color="#6C63FF" style={{ flexShrink: 0 }} />;
    };

    // Formata o tempo de forma amigável (Ex: "10:30")
    const formatarHora = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <header style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center", 
            padding: "20px 30px", background: "#fff", borderBottom: "1px solid #e2e8f0" 
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <button 
                    className="mobile-menu-btn" 
                    onClick={onMenuToggle} 
                    style={{ background: "none", border: "none", cursor: "pointer", display: "none", color: "#1e293b", padding: 0 }}
                >
                    <Menu size={26} />
                </button>
                <div className="header-title" style={{ color: "#64748b", fontSize: "0.95rem" }}>
                    Menu Principal / <strong style={{ color: "#1e293b" }}>{formatarTitulo()}</strong>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                
                <span className="badge-online" style={{ 
                    display: "flex", alignItems: "center", gap: "6px", background: "#dcfce7", color: "#15803d", 
                    padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" 
                }}>
                    <span style={{ width: "6px", height: "6px", background: "#15803d", borderRadius: "50%", display: "inline-block" }}></span>
                    Online
                </span>

                <div ref={notificacaoRef} style={{ position: "relative" }}>
                    <button 
                        onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
                        style={{ 
                            background: notificacoesAbertas ? "#f1f5f9" : "none", 
                            border: "none", cursor: "pointer", color: (naoLidas > 0 && notificacoesAtivas) ? "#1e293b" : "#64748b", 
                            padding: "8px", borderRadius: "50%", transition: "0.2s",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <Bell size={22} />
                        {/* 🔴 A Bolinha Vermelha com o número! */}
                        {naoLidas > 0 && notificacoesAtivas && (
                            <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#ef4444", color: "white", fontSize: "0.65rem", fontWeight: "bold", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                                {naoLidas}
                            </span>
                        )}
                    </button>

                    {notificacoesAbertas && (
                        <div className="notificacoes-dropdown" style={{ 
                            position: "absolute", top: "45px", right: "0", width: "350px", 
                            background: "#fff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
                            border: "1px solid #e2e8f0", zIndex: 9999, overflow: "hidden" 
                        }}>
                            <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: "700", color: "#1e293b" }}>Alertas do Sistema</span>
                                {naoLidas > 0 && (
                                    <button onClick={marcarTodasComoLidas} style={{ background: "transparent", border: "none", color: "#6C63FF", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Check size={14} /> Marcar todas como lidas
                                    </button>
                                )}
                            </div>
                            
                            <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                                {!notificacoesAtivas ? (
                                    <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8" }}>
                                        <BellOff size={30} color="#cbd5e1" style={{ margin: "0 auto 10px auto" }} />
                                        <p style={{ margin: 0, fontSize: "0.9rem" }}>Notificações desativadas nas Configurações.</p>
                                    </div>
                                ) : notificacoes.length > 0 ? (
                                    notificacoes.map(notif => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => !notif.lida && marcarComoLida(notif.id)}
                                            style={{ 
                                                padding: "15px 16px", borderBottom: "1px solid #f1f5f9", 
                                                display: "flex", gap: "12px", alignItems: "flex-start",
                                                background: notif.lida ? "#ffffff" : "#eff6ff", // Azul clarinho se não foi lida
                                                transition: "background 0.2s", cursor: notif.lida ? "default" : "pointer"
                                            }}
                                            onMouseOver={(e) => { if(!notif.lida) e.currentTarget.style.background = "#e0e7ff" }} 
                                            onMouseOut={(e) => { if(!notif.lida) e.currentTarget.style.background = "#eff6ff" }}
                                        >
                                            {descobrirIcone(notif.texto)}
                                            
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#334155", lineHeight: "1.4", fontWeight: notif.lida ? "500" : "700" }}>
                                                    {notif.texto}
                                                </p>
                                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "500" }}>
                                                    {formatarHora(notif.data_criacao)}
                                                </span>
                                            </div>
                                            
                                            {!notif.lida && (
                                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6C63FF", marginTop: "4px" }}></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8" }}>
                                        <CheckCircle2 size={30} color="#10b981" style={{ margin: "0 auto 10px auto", opacity: 0.5 }} />
                                        <p style={{ margin: 0, fontSize: "0.9rem" }}>Sua caixa de entrada está vazia.<br/>O fluxo cirúrgico está em dia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile-header" style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid #e2e8f0", paddingLeft: "20px" }}>
                    <div style={{ textAlign: "right" }}>
                        <strong style={{ display: "block", color: "#1e293b", fontSize: "0.9rem" }}>{nomeExibicao}</strong>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{cargoExibicao}</span>
                    </div>
                    <div style={{ 
                        width: "38px", height: "38px", background: "#6C63FF", color: "white", 
                        borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", 
                        fontWeight: "700", fontSize: "1.1rem", textTransform: "uppercase", flexShrink: 0 
                    }}>
                        {nomeExibicao ? nomeExibicao.charAt(0) : "U"}
                    </div>
                </div>

                <button 
                    onClick={logout} 
                    style={{ 
                        display: "flex", alignItems: "center", gap: "6px", background: "none", 
                        border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: "8px", 
                        color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", transition: "0.2s" 
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                    title="Sair do Sistema"
                >
                    <span className="logout-text">Sair</span> <LogOut size={16} />
                </button>

            </div>
        </header>
    );
}

export default Header;