import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const CirurgiasContext = createContext();

export function CirurgiasProvider({ children }) {
    const [listaCirurgias, setListaCirurgias] = useState([]);

    useEffect(() => {
        carregarCirurgias();
    }, []);

    async function carregarCirurgias() {
        const { data, error } = await supabase
            .from("cirurgias")
            .select(`*, medicos ( nome )`)
            .order('id', { ascending: false });

        if (error) console.error("Erro ao carregar cirurgias:", error.message);
        else setListaCirurgias(data || []);
    }

    async function adicionarCirurgia(novaCirurgia) {
        const { id, medicos, ...dados } = novaCirurgia; 
        
        const { data, error } = await supabase
            .from("cirurgias")
            .insert([dados])
            .select(`*, medicos ( nome )`); 
            
        if (error) {
            alert("Erro ao agendar cirurgia: " + error.message);
            throw error; // 👈 Avisa o formulário que deu ruim!
        } else {
            setListaCirurgias([data[0], ...listaCirurgias]);
        }
    }

    async function editarCirurgia(id, dadosAtualizados) {
        const { data, error } = await supabase
            .from("cirurgias")
            .update(dadosAtualizados)
            .eq("id", id)
            .select(`*, medicos ( nome )`); 

        if (error) {
            alert("Erro ao editar: " + error.message);
            throw error; // 👈 Avisa o formulário que deu ruim!
        } else if (data && data.length > 0) {
            setListaCirurgias(listaAtual => 
                listaAtual.map(cirurgia => cirurgia.id === id ? data[0] : cirurgia)
            );
        }
    }

    async function excluirCirurgia(id) {
        const { error } = await supabase.from("cirurgias").delete().eq("id", id);
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