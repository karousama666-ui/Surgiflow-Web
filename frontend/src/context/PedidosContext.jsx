import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const PedidosContext = createContext();

export function PedidosProvider({ children }) {
    const [listaPedidos, setListaPedidos] = useState([]);

    useEffect(() => {
        carregarPedidos();
    }, []);

    // 1. CARREGAR PEDIDOS
    async function carregarPedidos() {
        const { data, error } = await supabase.from("pedidos").select("*");
        if (error) console.error("Erro ao carregar pedidos:", error.message);
        else setListaPedidos(data || []);
    }

    // 2. SALVAR PEDIDO (Serve para criar um novo ou atualizar um que já existe)
    async function salvarPedido(dados) {
        if (dados.id) {
            // Atualiza
            const { error } = await supabase.from("pedidos").update(dados).eq("id", dados.id);
            if (!error) carregarPedidos();
        } else {
            // Cria novo
            const { error } = await supabase.from("pedidos").insert([dados]);
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