import Input from "../ui/Input";
import { useState } from "react";


function NovaCirurgiaForm({ onSave }) {

    const [form, setForm] = useState({

    paciente: "",

    medico: "",

    hospital: "",

    data: "",

    horario: "",

    status: "Pendente",

});

function handleChange(e){

    const { name, value } = e.target;

    setForm({

        ...form,

        [name]: value

    });

}

console.log(form);

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

            <Input

name="medico"

placeholder="Médico"

value={form.medico}

onChange={handleChange}

/>

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

<button

    onClick={() => onSave(form)}

>

    Salvar

</button>

        </>

    )

}

export default NovaCirurgiaForm;