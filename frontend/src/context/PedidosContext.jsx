import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext"; 

const PedidosContext = createContext();

export function PedidosProvider({ children }) {
    const [listaPedidos, setListaPedidos] = useState([]);
    const { workspaceId } = useAuth(); 

    useEffect(() => {
        if (workspaceId) {
            carregarPedidos();
        } else {
            setListaPedidos([]);
        }
    }, [workspaceId]);

    // 1. CARREGAR PEDIDOS
    async function carregarPedidos() {
        const { data, error } = await supabase
            .from("pedidos")
            .select("*")
            .eq("user_id", workspaceId); 
            
        if (error) console.error("Erro ao carregar pedidos:", error.message);
        else setListaPedidos(data || []);
    }

    // 2. SALVAR PEDIDO E DISPARAR SINO
    async function salvarPedido(dados) {
        if (dados.id) {
            // 🔔 A LÓGICA DO SINO ESTÁ AQUI
            // Pega o pedido antigo antes de salvar, para ver se o status mudou!
            const pedidoAntigo = listaPedidos.find(p => p.id === dados.id);
            const virouAprovado = pedidoAntigo && 
                                  pedidoAntigo.status !== "Aprovado" && 
                                  dados.status === "Aprovado";

            const { error } = await supabase
                .from("pedidos")
                .update(dados)
                .eq("id", dados.id)
                .eq("user_id", workspaceId); 
                
            if (!error) {
                carregarPedidos();
                
                // Se virou aprovado, joga a notificação no banco!
                if (virouAprovado) {
                    await supabase.from("notificacoes").insert([{
                        user_id: workspaceId,
                        texto: `✅ OPME Aprovado: O material do paciente ${dados.paciente || 'selecionado'} foi liberado!`
                    }]);
                }
            }
        } else {
            // Cria novo
            const { error } = await supabase
                .from("pedidos")
                .insert([{ ...dados, user_id: workspaceId }]); 
                
            if (!error) carregarPedidos();
        }
    }

    return (
        <PedidosContext.Provider value={{ listaPedidos, carregarPedidos, salvarPedido }}>
            {children}
        </PedidosContext.Provider>
    );
}

export const usePedidos = () => useContext(PedidosContext);