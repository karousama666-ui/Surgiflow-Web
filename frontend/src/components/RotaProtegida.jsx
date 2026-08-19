import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RotaProtegida({ children }) {
    const { user, loadingAuth } = useAuth();

    // Se ainda está verificando com o Supabase se tem login, mostra uma tela vazia ou de carregamento
    if (loadingAuth) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
                <p>Verificando credenciais...</p>
            </div>
        );
    }

    // Se checou e NÃO tem usuário, redireciona para a tela de Login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Se tem usuário, libera o acesso à página!
    return children;
}

export default RotaProtegida;