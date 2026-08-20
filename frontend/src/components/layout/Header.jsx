import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCirurgias } from "../../context/CirurgiasContext";
import { usePedidos } from "../../context/PedidosContext";
import { useLocation } from "react-router-dom";
import { Bell, LogOut, AlertCircle, PackageSearch, CheckCircle2 } from "lucide-react";
import { supabase } from "../../services/supabase.js"; // <- IMPORT DO BANCO AQUI!

function Header() {
    const { logout } = useAuth(); 
    const location = useLocation();
    
    // Garantindo que mesmo se o Context demorar, o sistema não quebre
    const { listaCirurgias = [] } = useCirurgias() || {};
    const { listaPedidos = [] } = usePedidos() || {};

    const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
    
    // ESTADOS DINÂMICOS DO USUÁRIO 👤
    const [nomeExibicao, setNomeExibicao] = useState("Carregando...");
    const [cargoExibicao, setCargoExibicao] = useState("Profissional de Saúde");

    // BUSCA O USUÁRIO LOGADO ASSIM QUE A TELA ABRE 🔄
    useEffect(() => {
        async function buscarUsuarioLogado() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user && user.user_metadata && user.user_metadata.nome) {
                    // Pega só o primeiro e o segundo nome para o layout ficar perfeito
                    const nomeCompleto = user.user_metadata.nome.split(" ");
                    const nomeCurto = `${nomeCompleto[0]} ${nomeCompleto[1] || ""}`;
                    
                    setNomeExibicao(nomeCurto);
                } else {
                    setNomeExibicao("Usuário");
                }
            } catch (error) {
                console.error("Erro ao puxar dados do usuário:", error);
                setNomeExibicao("Usuário");
            }
        }
        buscarUsuarioLogado();
    }, []);

    const formatarTitulo = () => {
        const path = location.pathname.replace("/", "");
        if (!path) return "Painel de Controle";
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    // Lógica Flexível para notificações
    const notificacoesReais = useMemo(() => {
        const alertas = [];
        let idCounter = 1;

        const opmesPendentes = listaPedidos.filter(p => {
            const status = p.status ? p.status.toLowerCase() : "";
            return status.includes("aguardando") || status.includes("aprovação") || status.includes("aprovacao");
        });
        
        opmesPendentes.forEach(opme => {
            const cirurgia = listaCirurgias.find(c => String(c.id) === String(opme.cirurgia_id));
            const nomePaciente = cirurgia ? cirurgia.paciente : "Paciente não identificado";
            
            alertas.push({
                id: idCounter++,
                tipo: "opme",
                texto: `OPME ${opme.status}: ${nomePaciente}`,
                tempo: "Requer atenção"
            });
        });

        const cirurgiasPendentes = listaCirurgias.filter(c => {
            const status = c.status ? c.status.toLowerCase().trim() : "";
            return status === "pendente";
        });
        
        cirurgiasPendentes.forEach(cirurgia => {
            let dataFormatada = "Data a definir";
            if (cirurgia.data_cirurgia) {
                const partes = cirurgia.data_cirurgia.split(" ")[0].split("-");
                if (partes.length === 3) dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            alertas.push({
                id: idCounter++,
                tipo: "cirurgia",
                texto: `Cirurgia pendente de confirmação: ${cirurgia.paciente}`,
                tempo: `Para: ${dataFormatada}`
            });
        });

        return alertas.slice(0, 5); 
    }, [listaCirurgias, listaPedidos]);

    const temAlerta = notificacoesReais.length > 0;

    return (
        <header style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center", 
            padding: "20px 30px", background: "#fff", borderBottom: "1px solid #e2e8f0" 
        }}>
            <div style={{ color: "#64748b", fontSize: "0.95rem" }}>
                Menu Principal / <strong style={{ color: "#1e293b" }}>{formatarTitulo()}</strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                
                <span style={{ 
                    display: "flex", alignItems: "center", gap: "6px", background: "#dcfce7", color: "#15803d", 
                    padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" 
                }}>
                    <span style={{ width: "6px", height: "6px", background: "#15803d", borderRadius: "50%", display: "inline-block" }}></span>
                    Online
                </span>

                <div style={{ position: "relative" }}>
                    <button 
                        onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
                        style={{ 
                            background: notificacoesAbertas ? "#f1f5f9" : "none", 
                            border: "none", cursor: "pointer", color: temAlerta ? "#1e293b" : "#64748b", 
                            padding: "8px", borderRadius: "50%", transition: "0.2s",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <Bell size={22} />
                        {temAlerta && (
                            <span style={{ position: "absolute", top: "5px", right: "6px", background: "#ef4444", width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #fff" }}></span>
                        )}
                    </button>

                    {notificacoesAbertas && (
                        <div style={{ 
                            position: "absolute", top: "45px", right: "0", width: "340px", 
                            background: "#fff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
                            border: "1px solid #e2e8f0", zIndex: 9999, overflow: "hidden" 
                        }}>
                            <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #e2e8f0", fontWeight: "700", color: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                Alertas do Sistema
                                <span style={{ fontSize: "0.75rem", background: "#e2e8f0", color: "#475569", padding: "2px 8px", borderRadius: "10px" }}>{notificacoesReais.length}</span>
                            </div>
                            
                            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                                {temAlerta ? (
                                    notificacoesReais.map(notif => (
                                        <div key={notif.id} style={{ 
                                            padding: "15px 16px", borderBottom: "1px solid #f1f5f9", 
                                            display: "flex", gap: "12px", alignItems: "flex-start" 
                                        }}>
                                            {notif.tipo === "opme" && <PackageSearch size={18} color="#f59e0b" style={{ marginTop: "2px", flexShrink: 0 }} />}
                                            {notif.tipo === "cirurgia" && <AlertCircle size={18} color="#ef4444" style={{ marginTop: "2px", flexShrink: 0 }} />}
                                            
                                            <div>
                                                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#334155", lineHeight: "1.4", fontWeight: "500" }}>
                                                    {notif.texto}
                                                </p>
                                                <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: "600" }}>{notif.tempo}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8" }}>
                                        <CheckCircle2 size={30} color="#10b981" style={{ margin: "0 auto 10px auto", opacity: 0.5 }} />
                                        <p style={{ margin: 0, fontSize: "0.9rem" }}>Nenhuma pendência!<br/>O fluxo cirúrgico está em dia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* BLOCO DO USUÁRIO DINÂMICO AQUI */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid #e2e8f0", paddingLeft: "20px" }}>
                    <div style={{ textAlign: "right" }}>
                        <strong style={{ display: "block", color: "#1e293b", fontSize: "0.9rem" }}>{nomeExibicao}</strong>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{cargoExibicao}</span>
                    </div>
                    <div style={{ 
                        width: "38px", height: "38px", background: "#6C63FF", color: "white", 
                        borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", 
                        fontWeight: "700", fontSize: "1.1rem", textTransform: "uppercase" 
                    }}>
                        {/* Pega a primeira letra do nome de forma segura */}
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
                >
                    Sair <LogOut size={16} />
                </button>

            </div>
        </header>
    );
}

export default Header;