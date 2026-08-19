import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const CirurgiasContext = createContext();

export function CirurgiasProvider({ children }) {
    const [listaCirurgias, setListaCirurgias] = useState([]);

    useEffect(() => {
        carregarCirurgias();
    }, []);

    // 1. CARREGAR
    async function carregarCirurgias() {
        const { data, error } = await supabase
            .from("cirurgias")
            .select(`
                *,
                medicos ( nome )
            `)
            .order('id', { ascending: false });

        if (error) console.error("Erro ao carregar cirurgias:", error.message);
        else setListaCirurgias(data || []);
    }

    // 2. ADICIONAR
    async function adicionarCirurgia(novaCirurgia) {
        const { id, medicos, ...dados } = novaCirurgia; 
        
        const { data, error } = await supabase
            .from("cirurgias")
            .insert([dados])
            .select(`*, medicos ( nome )`); 
            
        if (error) alert("Erro ao agendar cirurgia: " + error.message);
        else setListaCirurgias([data[0], ...listaCirurgias]); // Adiciona no começo da lista
    }

    // 3. EDITAR GERAL (Agora atualiza a tela na hora!)
    async function editarCirurgia(id, dadosAtualizados) {
        // Atualiza no Banco
        const { data, error } = await supabase
            .from("cirurgias")
            .update(dadosAtualizados)
            .eq("id", id)
            .select(`*, medicos ( nome )`); // Pede a cirurgia atualizada de volta

        if (error) {
            alert("Erro ao editar: " + error.message);
        } else if (data && data.length > 0) {
            // Atualiza na Tela imediatamente!
            setListaCirurgias(listaAtual => 
                listaAtual.map(cirurgia => 
                    cirurgia.id === id ? data[0] : cirurgia
                )
            );
        }
    }

    // 4. EXCLUIR
    async function excluirCirurgia(id) {
        const { error } = await supabase.from("cirurgias").delete().eq("id", id);
        
        if (error) alert("Erro ao excluir: " + error.message);
        else setListaCirurgias(listaCirurgias.filter(c => c.id !== id));
    }

    return (
        <CirurgiasContext.Provider value={{ 
            listaCirurgias, 
            carregarCirurgias, 
            adicionarCirurgia, 
            editarCirurgia, 
            excluirCirurgia 
        }}>
            {children}
        </CirurgiasContext.Provider>
    );
}

export const useCirurgias = () => useContext(CirurgiasContext);