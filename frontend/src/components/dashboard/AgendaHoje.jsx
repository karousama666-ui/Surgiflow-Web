import { useCirurgias } from "../../context/CirurgiasContext";

function AgendaHoje() {

    const { listaCirurgias } = useCirurgias();

    const hoje = new Date().toISOString().split("T")[0];

    const cirurgiasHoje = listaCirurgias

    .filter(

        cirurgia => cirurgia.data === hoje

    )

    .sort(

        (a, b) => a.horario.localeCompare(b.horario)

    );

    return (

    <div
        style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 5px 20px rgba(0,0,0,.08)"
        }}
    >

        <h2>📅 Agenda de Hoje</h2>

        <br />

        {cirurgiasHoje.length === 0 ? (

            <p>Nenhuma cirurgia cadastrada.</p>

        ) : (

            cirurgiasHoje.map((cirurgia) => (

                <div
    key={cirurgia.id}
    style={{

        background: "#F8F9FF",

        border: "1px solid #E8E9F3",

        borderRadius: "14px",

        padding: "18px",

        marginBottom: "16px"

    }}
>

                    <p>

    🕘 <strong>{cirurgia.horario}</strong>

</p>

<p>

    👤 {cirurgia.paciente}

</p>

<p>

    🏥 {cirurgia.hospital}

</p>

<p>

    📄 {cirurgia.convenio}

</p>

<p>

    {cirurgia.status === "Confirmada"

        ? "🟢"

        : cirurgia.status === "Pendente"

        ? "🟡"

        : "🔴"

    }

    {" "}

    {cirurgia.status}

</p>
                </div>

            ))

        )}

    </div>

);

}

export default AgendaHoje;