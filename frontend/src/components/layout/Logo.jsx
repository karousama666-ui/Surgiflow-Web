import React from "react";
import { useTheme } from "../../context/ThemeContext";

// Importando as duas versões da logo
import logoEscura from "../../assets/logo_surgiflowdark.png";
import logoBranca from "../../assets/logo_surgiflow.png";

function Logo() {
  const { theme } = useTheme(); // Puxa o tema atual

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center", // Garante que o texto fique centralizado
        marginBottom: "25px", // Reduzi um pouco para ficar mais próximo do menu
      }}
    >
      <img
        // Se o tema for escuro, usa a logo branca. Senão, usa a escura.
        src={theme === 'dark' ? logoBranca : logoEscura}
        alt="SurgiFlow"
        style={{
          width: "180px", // Reduzido para dar respiro nas laterais
          height: "auto",
          marginBottom: "10px",
          transition: "all 0.3s ease" // Suaviza a transição entre as logos
        }}
      />

      <p
        style={{
          color: "#9CA3AF", // Um tom um pouco mais suave (Fica ótimo nos dois temas!)
          fontSize: "12px", // Menor para não poluir
          fontWeight: "500",
          marginTop: "0",
          letterSpacing: "0.2px"
        }}
      >
        Gestão Inteligente de Cirurgias
      </p>
    </div>
  );
}

export default Logo;