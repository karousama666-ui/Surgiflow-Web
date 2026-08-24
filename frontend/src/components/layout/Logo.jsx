import React from "react";
import logo from "../../assets/logo_surgiflowdark.png";

function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center", 
        marginBottom: "25px", 
      }}
    >
      <img
        src={logo}
        alt="SurgiFlow"
        style={{
          width: "180px", 
          height: "auto",
          marginBottom: "10px",
        }}
      />

      <p
        style={{
          color: "#9CA3AF", 
          fontSize: "12px", 
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