import logo from "../../assets/logo_surgiflowdark.png";

function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "35px",
      }}
    >
      <img
        src={logo}
        alt="SurgiFlow"
        style={{
          width: "240px",
          marginBottom: "20px",
        }}
      />

      <p
        style={{
          color: "#6B7280",
          fontSize: "15px",
          marginTop: "-8px",
        }}
      >
        Gestão Inteligente de Cirurgias
      </p>
    </div>
  );
}

export default Logo;