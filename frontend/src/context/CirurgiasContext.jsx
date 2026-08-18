import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const CirurgiasContext = createContext();

export function CirurgiasProvider({ children }) {
    const [listaCirurgias, setListaCirurgias] = useState([]);

    useEffect(() => {
        carregarCirurgias();
    }, []);

    async function carregarCirurgias() {
        const { data, error } = await supabase.from("cirurgias").select("*");
        if (error) {
            console.error("Erro ao carregar cirurgias:", error.message);
        } else {
            setListaCirurgias(data || []);
        }
    }

    async function handleSetListaCirurgias(novaListaOuFuncao) {
        const novaLista = typeof novaListaOuFuncao === "function" 
            ? novaListaOuFuncao(listaCirurgias) 
            : novaListaOuFuncao;

        if (novaLista.length > listaCirurgias.length) {
            const ultimoItem = novaLista[novaLista.length - 1];
            const { id, anexo, ...dadosParaSalvar } = ultimoItem; // Ignora o arquivo local e o id temporário por enquanto

            const { data, error } = await supabase.from("cirurgias").insert([dadosParaSalvar]).select();
            if (error) {
                console.error("Erro ao salvar cirurgia no Supabase:", error.message);
                alert("Erro ao salvar cirurgia no banco: " + error.message);
            } else if (data) {
                setListaCirurgias(novaLista.map(c => c.id === id ? data[0] : c));
                return;
            }
        }

        setListaCirurgias(novaLista);
    }

    return (
        <CirurgiasContext.Provider
            value={{
                listaCirurgias,
                setListaCirurgias: handleSetListaCirurgias,
                carregarCirurgias
            }}
        >
            {children}
        </CirurgiasContext.Provider>
    );
}

export function useCirurgias() {
    return useContext(CirurgiasContext);
}