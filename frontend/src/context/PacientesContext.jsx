import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const PacientesContext = createContext({});

export function PacientesProvider({ children }) {
    const [listaPacientes, setListaPacientes] = useState([]);

    async function buscarPacientes() {
        // Busca os pacientes no banco, ordenando em ordem alfabética
        const { data, error } = await supabase
            .from("pacientes")
            .select("*")
            .order("nome", { ascending: true });
            
        if (!error && data) {
            setListaPacientes(data);
        }
    }

    // Busca os dados assim que o usuário entra no sistema
    useEffect(() => {
        buscarPacientes();
    }, []);

    async function adicionarPaciente(paciente) {
        const { data, error } = await supabase.from("pacientes").insert([paciente]).select();
        if (!error && data) {
            setListaPacientes([...listaPacientes, data[0]]);
        }
    }

    async function editarPaciente(id, dadosAtualizados) {
        const { data, error } = await supabase.from("pacientes").update(dadosAtualizados).eq("id", id).select();
        if (!error && data) {
            setListaPacientes(listaPacientes.map(p => p.id === id ? data[0] : p));
        }
    }

    async function excluirPaciente(id) {
        const { error } = await supabase.from("pacientes").delete().eq("id", id);
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