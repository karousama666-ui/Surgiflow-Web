import { useCirurgias } from "../../context/CirurgiasContext";

function HeaderDashboard() {

    const { listaCirurgias } = useCirurgias();

    const agora = new Date();

    const hora = agora.getHours();

    let saudacao = "Boa noite";

    if (hora < 12) {

        saudacao = "Bom dia";

    } else if (hora < 18) {

        saudacao = "Boa tarde";

    }

    const hoje = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const hojeISO = agora.toISOString().split("T")[0];

    const quantidadeHoje = listaCirurgias.filter(

        cirurgia => cirurgia.data === hojeISO

    ).length;

    return (

        <div
            style={{
                marginBottom: "30px"
            }}
        >

            <h1>

                {saudacao}, Carolina 👋

            </h1>

            <p
                style={{
                    color:"#666",
                    marginTop:"8px"
                }}
            >

                {hoje}

            </p>

            <p
                style={{
                    marginTop:"12px",
                    fontWeight:"600",
                    color:"#6C63FF"
                }}
            >

                Você possui {quantidadeHoje} cirurgia(s) agendada(s) para hoje.

            </p>

        </div>

    );

}

export default HeaderDashboard;