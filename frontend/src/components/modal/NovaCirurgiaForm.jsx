import Input from "../ui/Input";
import { useState, useEffect } from "react";
import { useMedicos } from "../../context/MedicosContext";

function NovaCirurgiaForm({

    onSave,

    dados

}) {

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

            medico: medicoSelecionado
                ? medicoSelecionado.nome
                : ""

        });

    }

    return (

        <>

            <Input
                name="paciente"
                placeholder="Paciente"
                value={form.paciente}
                onChange={handleChange}
            />

            <br />
            <br />

            <label>

                Médico

            </label>

            <br />

            <select
                name="medicoId"
                value={form.medicoId}
                onChange={handleMedicoChange}
            >

                <option value="">

                    Selecione um médico

                </option>

                {listaMedicos.map(medico => (

                    <option
                        key={medico.id}
                        value={medico.id}
                    >

                        {medico.nome}

                    </option>

                ))}

            </select>

            <br />
            <br />

            <Input
                name="hospital"
                placeholder="Hospital"
                value={form.hospital}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="convenio"
                placeholder="Convênio"
                value={form.convenio}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="horario"
                type="time"
                value={form.horario}
                onChange={handleChange}
            />

            <br />
            <br />

            <label>

                Anexo

            </label>

            <br />

            <input
                type="file"
                onChange={(e) => {

                    setForm({

                        ...form,

                        anexo: e.target.files[0]

                    });

                }}
            />

            <br />
            <br />

            {form.anexo && (

                <p
                    style={{
                        marginTop: "10px",
                        color: "#6C63FF",
                        fontWeight: "600"
                    }}
                >

                    📎 {form.anexo.name}

                </p>

            )}

            <button

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

            >

                Salvar

            </button>

        </>

    );

}

export default NovaCirurgiaForm;