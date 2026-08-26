import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext"; 

const CirurgiasContext = createContext();

export function CirurgiasProvider({ children }) {
    const [listaCirurgias, setListaCirurgias] = useState([]);
    const { workspaceId } = useAuth(); 

    useEffect(() => {
        if (workspaceId) {
            carregarCirurgias();
        } else {
            setListaCirurgias([]); 
        }
    }, [workspaceId]);

    async function carregarCirurgias() {
        const { data, error } = await supabase
            .from("cirurgias")
            .select(`*, medicos ( nome )`)
            .eq('user_id', workspaceId) 
            .order('id', { ascending: false });

        if (error) {
            console.error("Erro ao carregar cirurgias:", error.message);
        } else {
            setListaCirurgias(data || []);
            
            // 🔔 LÓGICA DO SINO: CIRURGIAS DE HOJE
            if (data && data.length > 0) {
                // Pega a data de hoje no formato YYYY-MM-DD
                const dataAtual = new Date();
                const hoje = dataAtual.getFullYear() + "-" + String(dataAtual.getMonth() + 1).padStart(2, '0') + "-" + String(dataAtual.getDate()).padStart(2, '0');
                
                // Filtra quantas cirurgias estão marcadas para hoje
                const cirurgiasHoje = data.filter(c => c.data_cirurgia && c.data_cirurgia.startsWith(hoje));
                
                if (cirurgiasHoje.length > 0) {
                    // REGRA ANTI-SPAM: Verifica no banco se já enviamos esse lembrete hoje
                    const { data: jaNotificou } = await supabase
                        .from("notificacoes")
                        .select("id")
                        .eq("user_id", workspaceId)
                        .like("texto", "%Cirurgias de hoje%")
                        .gte("data_criacao", hoje + "T00:00:00Z");

                    if (!jaNotificou || jaNotificou.length === 0) {
                        await supabase.from("notificacoes").insert([{
                            user_id: workspaceId,
                            texto: `📅 Lembrete: Cirurgias de hoje! Você tem ${cirurgiasHoje.length} cirurgia(s) agendada(s) para hoje.`
                        }]);
                    }
                }
            }
        }
    }

    async function adicionarCirurgia(novaCirurgia) {
        const { id, medicos, ...dados } = novaCirurgia; 
        
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
            
            // 🔔 BÔNUS: Avisa a equipe que uma nova cirurgia foi agendada!
            await supabase.from("notificacoes").insert([{
                user_id: workspaceId,
                texto: `🏥 Nova Cirurgia: Foi agendada uma cirurgia para o(a) paciente ${dados.paciente}.`
            }]);
        }
    }

    async function editarCirurgia(id, dadosAtualizados) {
        const { data, error } = await supabase
            .from("cirurgias")
            .update(dadosAtualizados)
            .eq("id", id)
            .eq("user_id", workspaceId) 
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
            .eq("user_id", workspaceId); 
            
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