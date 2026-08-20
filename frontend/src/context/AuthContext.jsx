import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Força o React a ESPERAR o Supabase ir no cofre do navegador buscar a sessão
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUsuario(session?.user ?? null);
            setLoading(false);
        });

        // 2. O "Olheiro": Fica monitorando se a sessão expirou, se fez login em outra aba, etc.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUsuario(session?.user ?? null);
            setLoading(false);
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

    // Função de Recuperação de Senha
    const recuperarSenha = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, recuperarSenha, loading }}>
            {/* O pulo do gato: O aplicativo inteiro SÓ carrega depois que o loading for false */}
            {!loading && children} 
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);