import { useState, useEffect } from "react";
import Input from "../ui/Input";
import { useMedicos } from "../../context/MedicosContext";

function MedicoForm({
    medicoEditando,
    setMedicoEditando
}) {

    const {
        listaMedicos,
        setListaMedicos
    } = useMedicos();

    const [form, setForm] = useState({

        nome: "",
        crm: "",
        especialidade: "",
        telefone: "",
        email: "",
        hospital: ""

    });

    useEffect(() => {

        if (medicoEditando) {

            setForm({

                nome: medicoEditando.nome || "",
                crm: medicoEditando.crm || "",
                especialidade: medicoEditando.especialidade || "",
                telefone: medicoEditando.telefone || "",
                email: medicoEditando.email || "",
                hospital: medicoEditando.hospital || ""

            });

        }

    }, [medicoEditando]);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm({

            ...form,

            [name]: value

        });

    }

    function limparFormulario() {

        setForm({

            nome: "",
            crm: "",
            especialidade: "",
            telefone: "",
            email: "",
            hospital: ""

        });

        setMedicoEditando(null);

    }

    function handleSave() {

        if (!form.nome || !form.crm) {

            alert(
                "Preencha pelo menos o nome e o CRM do médico."
            );

            return;

        }

        if (medicoEditando) {

            const listaAtualizada = listaMedicos.map(
                medico => {

                    if (medico.id === medicoEditando.id) {

                        return {

                            ...medico,
                            ...form

                        };

                    }

                    return medico;

                }
            );

            setListaMedicos(listaAtualizada);

            alert("Médico atualizado com sucesso!");

            limparFormulario();

            return;

        }

        const novoMedico = {

            id: Date.now(),

            ...form

        };

        setListaMedicos([

            ...listaMedicos,
            novoMedico

        ]);

        alert("Médico cadastrado com sucesso!");

        limparFormulario();

    }

    return (

        <div>

            <h2>

                {medicoEditando
                    ? "Editar Médico"
                    : "Novo Médico"
                }

            </h2>

            <br />

            <Input
                name="nome"
                placeholder="Nome completo"
                value={form.nome}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="crm"
                placeholder="CRM"
                value={form.crm}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="especialidade"
                placeholder="Especialidade"
                value={form.especialidade}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="telefone"
                placeholder="Telefone"
                value={form.telefone}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="email"
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
            />

            <br />
            <br />

            <Input
                name="hospital"
                placeholder="Hospital principal"
                value={form.hospital}
                onChange={handleChange}
            />

            <br />
            <br />

            <button
                type="button"
                onClick={handleSave}
            >

                {medicoEditando
                    ? "Salvar Alterações"
                    : "Salvar Médico"
                }

            </button>

            {medicoEditando && (

                <button
                    type="button"
                    onClick={limparFormulario}
                    style={{
                        marginLeft: "10px"
                    }}
                >

                    Cancelar

                </button>

            )}

        </div>

    );

}

export default MedicoForm;