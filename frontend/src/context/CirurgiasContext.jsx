import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext"; // 👈 NOVO: Importamos o AuthContext para roubar o Workspace ID

const CirurgiasContext = createContext();

export function CirurgiasProvider({ children }) {
    const [listaCirurgias, setListaCirurgias] = useState([]);
    
    // 👈 NOVO: Pega o workspaceId do dono da clínica
    const { workspaceId } = useAuth(); 

    useEffect(() => {
        // Só tenta carregar as cirurgias SE já tiver descoberto quem é o dono do Workspace
        if (workspaceId) {
            carregarCirurgias();
        } else {
            setListaCirurgias([]); // Zera a lista se fizer logout
        }
    }, [workspaceId]);

    async function carregarCirurgias() {
        const { data, error } = await supabase
            .from("cirurgias")
            .select(`*, medicos ( nome )`)
            .eq('user_id', workspaceId) // 👈 O SEGREDO: Só busca as cirurgias desta clínica!
            .order('id', { ascending: false });

        if (error) console.error("Erro ao carregar cirurgias:", error.message);
        else setListaCirurgias(data || []);
    }

    async function adicionarCirurgia(novaCirurgia) {
        const { id, medicos, ...dados } = novaCirurgia; 
        
        // 👈 NOVO: Carimba a nova cirurgia com o ID do dono da clínica
        const cirurgiaCarimbada = {
            ...dados,
            user_id: workspaceId 
        };
        
        const { data, error } = await supabase
            .from("cirurgias")
            .insert([cirurgiaCarimbada])
            .select(`*, medicos ( nome )`); 
            
        if (error) {
            alert("Erro ao agendar cirurgia: " + error.message);
            throw error; 
        } else {
            setListaCirurgias([data[0], ...listaCirurgias]);
        }
    }

    async function editarCirurgia(id, dadosAtualizados) {
        const { data, error } = await supabase
            .from("cirurgias")
            .update(dadosAtualizados)
            .eq("id", id)
            .eq("user_id", workspaceId) // 👈 Garante que só pode editar cirurgia da própria clínica
            .select(`*, medicos ( nome )`); 

        if (error) {
            alert("Erro ao editar: " + error.message);
            throw error; 
        } else if (data && data.length > 0) {
            setListaCirurgias(listaAtual => 
                listaAtual.map(cirurgia => cirurgia.id === id ? data[0] : cirurgia)
            );
        }
    }

    async function excluirCirurgia(id) {
        const { error } = await supabase
            .from("cirurgias")
            .delete()
            .eq("id", id)
            .eq("user_id", workspaceId); // 👈 Proteção extra de exclusão
            
        if (error) alert("Erro ao excluir: " + error.message);
        else setListaCirurgias(listaCirurgias.filter(c => c.id !== id));
    }

    return (
        <CirurgiasContext.Provider value={{ 
            listaCirurgias, carregarCirurgias, adicionarCirurgia, editarCirurgia, excluirCirurgia 
        }}>
            {children}
        </CirurgiasContext.Provider>
    );
}

export const useCirurgias = () => useContext(CirurgiasContext);