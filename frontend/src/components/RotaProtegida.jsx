import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RotaProtegida({ children }) {
    const { usuario } = useAuth();

    // Se não tiver um usuário real verificado pelo Supabase, é expulso para a tela de Login!
    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RotaProtegida;