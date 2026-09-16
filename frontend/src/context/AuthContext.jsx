import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [workspaceId, setWorkspaceId] = useState(null); 

    useEffect(() => {
        // Função para carregar e FORÇAR a renovação do crachá
        const carregarSessao = async () => {
            try {
                // 1. Pega a sessão atual do navegador
                let { data: { session } } = await supabase.auth.getSession();
                
                // 2. O PULO DO GATO: Se tiver alguém logado, obriga o Supabase a 
                // ir no servidor buscar os dados mais frescos (Ex: Plano Pro que acabou de ser pago)
                if (session) {
                    const { data: refreshedData, error } = await supabase.auth.refreshSession();
                    if (!error && refreshedData.session) {
                        session = refreshedData.session;
                    }
                }

                const user = session?.user ?? null;
                setUsuario(user);
                
                if (user) {
                    const chefaoId = user.user_metadata?.conta_chefe_id;
                    setWorkspaceId(chefaoId ? chefaoId : user.id);
                } else {
                    setWorkspaceId(null);
                }
            } catch (erro) {
                console.error("Erro ao renovar a sessão:", erro);
            } finally {
                setLoading(false);
            }
        };

        carregarSessao();

        // O "Olheiro" continua monitorando abas abertas e logins ao vivo
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            setUsuario(user);
            
            if (user) {
                const chefaoId = user.user_metadata?.conta_chefe_id;
                setWorkspaceId(chefaoId ? chefaoId : user.id);
            } else {
                setWorkspaceId(null);
            }
            
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, senha) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });
        
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Erro ao sair:", error.message);
    };

    const recuperarSenha = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ usuario, workspaceId, login, logout, recuperarSenha, loading }}>
            {!loading && children} 
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);