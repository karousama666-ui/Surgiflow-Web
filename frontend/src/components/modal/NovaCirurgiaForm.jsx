import Input from "../ui/Input";
import { useState, useEffect } from "react";


function NovaCirurgiaForm({

    onSave,

    dados

}) {

    const [form, setForm] = useState({

    paciente: "",

    medico: "",

    hospital: "",
    
    convenio: "",

    data: "",

    horario: "",
    
    anexo: null

});

useEffect(() => {

    if(dados){

        setForm(dados);

    }

}, [dados]);

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

    )

}

export default NovaCirurgiaForm;