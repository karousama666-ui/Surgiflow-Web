import logo from "../../assets/logo_surgiflowdark.png";

function Logo() {
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
        src={logo}
        alt="SurgiFlow"
        style={{
          width: "180px", // Reduzido para dar respiro nas laterais
          height: "auto",
          marginBottom: "10px",
        }}
      />

      <p
        style={{
          color: "#9CA3AF", // Um tom um pouco mais suave
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