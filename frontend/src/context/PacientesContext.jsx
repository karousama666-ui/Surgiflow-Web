import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext"; // 👈 Importa a chave mestra

const PacientesContext = createContext({});

export function PacientesProvider({ children }) {
    const [listaPacientes, setListaPacientes] = useState([]);
    const { workspaceId } = useAuth(); // 👈 Pega a chave da clínica atual

    useEffect(() => {
        if (workspaceId) {
            buscarPacientes();
        } else {
            setListaPacientes([]);
        }
    }, [workspaceId]);

    async function buscarPacientes() {
        const { data, error } = await supabase
            .from("pacientes")
            .select("*")
            .eq("user_id", workspaceId) // 👈 Filtra pela clínica
            .order("nome", { ascending: true });
            
        if (!error && data) {
            setListaPacientes(data);
        }
    }

    async function adicionarPaciente(paciente) {
        const { data, error } = await supabase
            .from("pacientes")
            .insert([{ ...paciente, user_id: workspaceId }]) // 👈 Salva carimbado
            .select();
            
        if (!error && data) {
            setListaPacientes([...listaPacientes, data[0]]);
        }
    }

    async function editarPaciente(id, dadosAtualizados) {
        const { data, error } = await supabase
            .from("pacientes")
            .update(dadosAtualizados)
            .eq("id", id)
            .eq("user_id", workspaceId) // 👈 Segurança
            .select();
            
        if (!error && data) {
            setListaPacientes(listaPacientes.map(p => p.id === id ? data[0] : p));
        }
    }

    async function excluirPaciente(id) {
        const { error } = await supabase
            .from("pacientes")
            .delete()
            .eq("id", id)
            .eq("user_id", workspaceId); // 👈 Segurança
            
        if (!error) {
            setListaPacientes(listaPacientes.filter(p => p.id !== id));
        }
    }

    return (
        <PacientesContext.Provider value={{ listaPacientes, adicionarPaciente, editarPaciente, excluirPaciente }}>
            {children}
        </PacientesContext.Provider>
    );
}

export const usePacientes = () => useContext(PacientesContext);