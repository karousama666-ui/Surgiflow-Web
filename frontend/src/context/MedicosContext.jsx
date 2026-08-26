import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext"; // 👈 Importa a chave mestra

const MedicosContext = createContext();

export function MedicosProvider({ children }) {
    const [listaMedicos, setListaMedicos] = useState([]);
    const { workspaceId } = useAuth(); // 👈 Pega a chave da clínica atual

    useEffect(() => {
        if (workspaceId) {
            carregarMedicos();
        } else {
            setListaMedicos([]);
        }
    }, [workspaceId]);

    async function carregarMedicos() {
        const { data, error } = await supabase
            .from("medicos")
            .select("*")
            .eq("user_id", workspaceId); // 👈 Filtra pela clínica

        if (error) console.error("Erro ao carregar:", error.message);
        else setListaMedicos(data || []);
    }

    // ADICIONAR
    async function adicionarMedico(novoMedico) {
        const { id, ...dados } = novoMedico; 
        const { data, error } = await supabase
            .from("medicos")
            .insert([{ ...dados, user_id: workspaceId }]) // 👈 Salva carimbado com a clínica
            .select();
            
        if (error) alert("Erro ao salvar: " + error.message);
        else setListaMedicos([...listaMedicos, data[0]]);
    }

    // EDITAR
    async function editarMedico(id, dadosAtualizados) {
        const { error } = await supabase
            .from("medicos")
            .update(dadosAtualizados)
            .eq("id", id)
            .eq("user_id", workspaceId); // 👈 Segurança
            
        if (error) alert("Erro ao editar: " + error.message);
        else {
            setListaMedicos(listaMedicos.map(m => m.id === id ? { ...m, ...dadosAtualizados } : m));
        }
    }

    // EXCLUIR
    async function excluirMedico(id) {
        const { error } = await supabase
            .from("medicos")
            .delete()
            .eq("id", id)
            .eq("user_id", workspaceId); // 👈 Segurança
            
        if (error) alert("Erro ao excluir: " + error.message);
        else setListaMedicos(listaMedicos.filter(m => m.id !== id));
    }

    return (
        <MedicosContext.Provider value={{ listaMedicos, adicionarMedico, editarMedico, excluirMedico }}>
            {children}
        </MedicosContext.Provider>
    );
}

export const useMedicos = () => useContext(MedicosContext);