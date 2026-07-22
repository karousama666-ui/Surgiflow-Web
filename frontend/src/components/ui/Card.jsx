function Card({ children }) {
  return (

    <div
      style={{

        width: "420px",

        background: "#FFF",

        padding: "40px",

        borderRadius: "20px",

        boxShadow: "0 10px 30px rgba(0,0,0,.08)",

      }}
    >

      {children}

    </div>

  );
}

export default Card;