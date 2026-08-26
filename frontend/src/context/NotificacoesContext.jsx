import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext";

const NotificacoesContext = createContext();

export function NotificacoesProvider({ children }) {
    const [notificacoes, setNotificacoes] = useState([]);
    const { workspaceId } = useAuth(); // 👈 Pega a chave da clínica atual

    useEffect(() => {
        if (workspaceId) {
            carregarNotificacoes();
            
            // 📡 RADAR EM TEMPO REAL: Escuta qualquer aviso novo que cair no banco
            const canalNotificacoes = supabase.channel(`notificacoes_radar_${workspaceId}`)
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'notificacoes', 
                    filter: `user_id=eq.${workspaceId}` 
                }, (payload) => {
                    // Quando chega notificação nova, coloca ela no topo da lista!
                    setNotificacoes((listaAtual) => [payload.new, ...listaAtual]);
                    
                    // Opcional: Toca um sonzinho rápido (descomente se quiser)
                    // new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3").play().catch(()=>{}):
                }).subscribe();

            return () => {
                supabase.removeChannel(canalNotificacoes);
            };
        } else {
            setNotificacoes([]);
        }
    }, [workspaceId]);

    async function carregarNotificacoes() {
        const { data, error } = await supabase
            .from('notificacoes')
            .select('*')
            .eq('user_id', workspaceId)
            .order('data_criacao', { ascending: false })
            .limit(20); // Carrega só as 20 mais recentes para não pesar
            
        if (!error && data) setNotificacoes(data);
    }

    async function marcarComoLida(id) {
        const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
        if (!error) {
            setNotificacoes(lista => lista.map(n => n.id === id ? { ...n, lida: true } : n));
        }
    }
    
    async function marcarTodasComoLidas() {
        const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('user_id', workspaceId).eq('lida', false);
        if (!error) {
            setNotificacoes(lista => lista.map(n => ({ ...n, lida: true })));
        }
    }

    // Calcula quantas bolinhas vermelhas mostrar
    const naoLidas = notificacoes.filter(n => !n.lida).length;

    return (
        <NotificacoesContext.Provider value={{ notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas }}>
            {children}
        </NotificacoesContext.Provider>
    );
}

export const useNotificacoes = () => useContext(NotificacoesContext);