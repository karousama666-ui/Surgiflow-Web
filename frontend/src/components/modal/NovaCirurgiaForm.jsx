import { useState, useEffect } from "react";
import { useMedicos } from "../../context/MedicosContext";

function NovaCirurgiaForm({ onSave, dados }) {
    const { listaMedicos } = useMedicos();

    const [form, setForm] = useState({
        paciente: "",
        medico: "",
        medicoId: "",
        hospital: "",
        convenio: "",
        data: "",
        horario: "",
        anexo: null
    });

    useEffect(() => {
        if (dados) {
            setForm({
                ...dados,
                medicoId: dados.medicoId || ""
            });
        }
    }, [dados]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    function handleMedicoChange(e) {
        const medicoId = e.target.value;
        const medicoSelecionado = listaMedicos.find(
            medico => String(medico.id) === medicoId
        );

        setForm({
            ...form,
            medicoId: medicoId,
            medico: medicoSelecionado ? medicoSelecionado.nome : ""
        });
    }

    const inputStyle = {
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none",
        backgroundColor: "#fff",
        color: "#1e293b",
        boxSizing: "border-box",
        marginBottom: "16px"
    };

    const labelStyle = {
        display: "block",
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "6px",
        textTransform: "uppercase",
        letterSpacing: "0.4px"
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>
                <label style={labelStyle}>Paciente</label>
                <input
                    type="text"
                    name="paciente"
                    placeholder="Nome completo do paciente"
                    value={form.paciente}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>Médico Responsável</label>
                <select
                    name="medicoId"
                    value={form.medicoId}
                    onChange={handleMedicoChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                >
                    <option value="">Selecione um médico</option>
                    {listaMedicos.map(medico => (
                        <option key={medico.id} value={medico.id}>
                            {medico.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label style={labelStyle}>Hospital</label>
                <input
                    type="text"
                    name="hospital"
                    placeholder="Hospital principal"
                    value={form.hospital}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>Convênio</label>
                <input
                    type="text"
                    name="convenio"
                    placeholder="Convênio médico"
                    value={form.convenio}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                    <label style={labelStyle}>Data da Cirurgia</label>
                    <input
                        type="date"
                        name="data"
                        value={form.data}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Horário</label>
                    <input
                        type="time"
                        name="horario"
                        value={form.horario}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Anexo de Documentos / Pedido</label>
                <input
                    type="file"
                    onChange={(e) => {
                        setForm({
                            ...form,
                            anexo: e.target.files[0]
                        });
                    }}
                    style={{
                        ...inputStyle,
                        padding: "10px",
                        background: "#f8fafc",
                        cursor: "pointer"
                    }}
                />
                {form.anexo && (
                    <p style={{ marginTop: "-8px", marginBottom: "12px", color: "#6C63FF", fontSize: "0.85rem", fontWeight: "600" }}>
                        📎 {form.anexo.name}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => {
                    onSave(form);
                    setForm({
                        paciente: "",
                        medico: "",
                        medicoId: "",
                        hospital: "",
                        convenio: "",
                        data: "",
                        horario: "",
                        anexo: null
                    });
                }}
                style={{
                    background: "#6C63FF",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    marginTop: "10px",
                    transition: "opacity 0.2s"
                }}
            >
                Salvar Cirurgia
            </button>
        </div>
    );
}

export default NovaCirurgiaForm;