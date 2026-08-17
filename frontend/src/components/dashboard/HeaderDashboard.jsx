import { useCirurgias } from "../../context/CirurgiasContext";

function HeaderDashboard() {

    const { listaCirurgias } = useCirurgias();

    const agora = new Date();

    const hoje = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const hojeISO = agora.toISOString().split("T")[0];

    const quantidadeHoje = listaCirurgias.filter(
        cirurgia => {

            if (cirurgia.data === hojeISO) {

                return true;

            }

            if (cirurgia.data?.includes("/")) {

                const [dia, mes, ano] =
                    cirurgia.data.split("/");

                return `${ano}-${mes}-${dia}` === hojeISO;

            }

            return false;

        }
    ).length;


    return (

        <div
            style={{
                marginBottom: "30px"
            }}
        >

            <p
                style={{
                    color: "#777",
                    fontSize: "14px",
                    margin: "0 0 6px 0",
                    textTransform: "capitalize"
                }}
            >

                {hoje}

            </p>


            <p
                style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#6C63FF"
                }}
            >

                Você possui{" "}

                {quantidadeHoje}

                {" "}

                {quantidadeHoje === 1
                    ? "cirurgia agendada"
                    : "cirurgias agendadas"
                }

                {" "}para hoje.

            </p>

        </div>

    );

}

export default HeaderDashboard;