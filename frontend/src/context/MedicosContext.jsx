import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const MedicosContext = createContext();

export function MedicosProvider({ children }) {
    const [listaMedicos, setListaMedicos] = useState([]);

    useEffect(() => {
        carregarMedicos();
    }, []);

    async function carregarMedicos() {
        const { data, error } = await supabase.from("medicos").select("*");
        if (error) {
            console.error("Erro ao carregar médicos:", error.message);
        } else {
            setListaMedicos(data || []);
        }
    }

    // Função customizada para lidar com inserção ou substituição da lista
    async function handleSetListaMedicos(novaListaOuFuncao) {
        const novaLista = typeof novaListaOuFuncao === "function" 
            ? novaListaOuFuncao(listaMedicos) 
            : novaListaOuFuncao;

        // Se o usuário adicionou um item novo (tamanho maior que o anterior)
        if (novaLista.length > listaMedicos.length) {
            const ultimoItem = novaLista[novaLista.length - 1];
            // Remove o id local gerado por Date.now() para o Supabase gerar o ID correto (se for UUID ou auto-incremento)
            const { id, ...dadosParaSalvar } = ultimoItem;

            const { data, error } = await supabase.from("medicos").insert([dadosParaSalvar]).select();
            if (error) {
                console.error("Erro ao salvar médico no Supabase:", error.message);
                alert("Erro ao salvar no banco de dados: " + error.message);
            } else if (data) {
                // Atualiza com o registro oficial vindo do banco
                setListaMedicos(novaLista.map(m => m.id === id ? data[0] : m));
                return;
            }
        }

        setListaMedicos(novaLista);
    }

    return (
        <MedicosContext.Provider
            value={{
                listaMedicos,
                setListaMedicos: handleSetListaMedicos,
                carregarMedicos
            }}
        >
            {children}
        </MedicosContext.Provider>
    );
}

export function useMedicos() {
    return useContext(MedicosContext);
}