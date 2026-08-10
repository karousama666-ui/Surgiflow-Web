import { useState } from "react";
import Input from "../ui/Input";
import { useMedicos } from "../../context/MedicosContext";

function MedicoForm() {

    const { listaMedicos, setListaMedicos } = useMedicos();

    const [form, setForm] = useState({

        nome: "",
        crm: "",
        especialidade: "",
        telefone: "",
        email: "",
        hospital: ""

    });

    function handleChange(e) {

        const { name, value } = e.target;

        setForm({

            ...form,

            [name]: value

        });

    }

    function handleSave() {

        if (!form.nome || !form.crm) {

            alert("Preencha pelo menos o nome e o CRM do médico.");

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

        setForm({

            nome: "",
            crm: "",
            especialidade: "",
            telefone: "",
            email: "",
            hospital: ""

        });

        alert("Médico cadastrado com sucesso!");

    }

    return (

        <div>

            <h2>Novo Médico</h2>

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

                Salvar Médico

            </button>

        </div>

    );

}

export default MedicoForm;