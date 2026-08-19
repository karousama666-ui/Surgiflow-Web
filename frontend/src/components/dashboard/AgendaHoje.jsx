import { useCirurgias } from "../../context/CirurgiasContext";

function AgendaHoje() {
    const { listaCirurgias } = useCirurgias();

    // Pega a data exata de hoje corrigida para evitar bug de fuso horário
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const hoje = `${ano}-${mes}-${dia}`;

    const cirurgiasHoje = listaCirurgias
        .filter((cirurgia) => {
            // Lendo o campo correto do Supabase
            return cirurgia.data_cirurgia && cirurgia.data_cirurgia.startsWith(hoje);
        })
        .sort((a, b) => {
            const timeA = a.data_cirurgia ? a.data_cirurgia.split(" ")[1] : "00:00";
            const timeB = b.data_cirurgia ? b.data_cirurgia.split(" ")[1] : "00:00";
            return timeA.localeCompare(timeB);
        });

    function obterNomeMedico(cirurgia) {
        // Agora pegamos direto da relação criada lá no banco
        return cirurgia.medicos && cirurgia.medicos.nome
            ? cirurgia.medicos.nome
            : "Médico não informado";
    }

    function obterStatus(status) {
        if (status === "Confirmada") return { icone: "🟢", background: "#ECFDF3", color: "#15803D" };
        if (status === "Pendente") return { icone: "🟡", background: "#FFFBEB", color: "#B45309" };
        if (status === "Finalizada") return { icone: "🔵", background: "#EFF6FF", color: "#2563EB" };
        return { icone: "🔴", background: "#FEF2F2", color: "#DC2626" };
    }

    return (
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 25px rgba(0,0,0,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: "21px" }}>📅 Agenda de Hoje</h2>
                    <span style={{ color: "#888", fontSize: "13px" }}>Cirurgias programadas para hoje</span>
                </div>
                <span style={{ background: "#EEF2FF", color: "#6C63FF", padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                    {cirurgiasHoje.length} {cirurgiasHoje.length === 1 ? "cirurgia" : "cirurgias"}
                </span>
            </div>

            {cirurgiasHoje.length === 0 ? (
                <div style={{ padding: "35px 20px", textAlign: "center", background: "#F8F9FF", borderRadius: "14px", color: "#888" }}>
                    <div style={{ fontSize: "30px", marginBottom: "8px" }}>📭</div>
                    Nenhuma cirurgia programada para hoje.
                </div>
            ) : (
                <div>
                    {cirurgiasHoje.map((cirurgia) => {
                        const status = obterStatus(cirurgia.status);
                        const horario = cirurgia.data_cirurgia ? cirurgia.data_cirurgia.split(" ")[1] : "Não informado";

                        return (
                            <div key={cirurgia.id} style={{ display: "grid", gridTemplateColumns: "75px 1fr auto", alignItems: "center", gap: "18px", padding: "16px 0", borderBottom: "1px solid #F0F0F5" }}>
                                <div style={{ fontSize: "18px", fontWeight: "700", color: "#6C63FF" }}>
                                    {horario}
                                </div>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: "650", color: "#222", marginBottom: "5px" }}>
                                        👤 {cirurgia.paciente}
                                    </div>
                                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", color: "#777", fontSize: "13px" }}>
                                        <span>👨‍⚕️ {obterNomeMedico(cirurgia)}</span>
                                        <span>🏥 {cirurgia.hospital}</span>
                                    </div>
                                </div>
                                <span style={{ background: status.background, color: status.color, padding: "7px 11px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                                    {status.icone} {cirurgia.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AgendaHoje;