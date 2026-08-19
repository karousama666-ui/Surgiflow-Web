import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Checa se já existe uma sessão segura ativa quando o app abre
        const checarSessao = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUsuario(session?.user || null);
            setLoading(false);
        };
        
        checarSessao();

        // 2. Fica "escutando" as mudanças (ex: se o token expirar ou o usuário deslogar)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUsuario(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Função REAL de Login conectada ao Supabase
    const login = async (email, senha) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });
        
        if (error) {
            throw error; // Repassa o erro para a tela de login mostrar (ex: "Senha incorreta")
        }
        return data;
    };

    // Função REAL de Logout
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Erro ao sair:", error.message);
    };

    // 👇 INSERIDO COM PINÇA: Só essa função nova, sem mexer na sua lógica original!
    const recuperarSenha = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    };

    return (
        // 👇 Inserimos o recuperarSenha aqui para o Login poder usar
        <AuthContext.Provider value={{ usuario, login, logout, recuperarSenha, loading }}>
            {/* Só carrega o sistema depois de verificar a segurança */}
            {!loading && children} 
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);