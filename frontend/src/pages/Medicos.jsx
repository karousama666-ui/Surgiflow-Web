import { useState } from "react";
import { useMedicos } from "../context/MedicosContext";
import MedicoForm from "../components/medicos/MedicoForm";
import MedicoCard from "../components/medicos/MedicoCard";

function Medicos() {

    const {
        listaMedicos,
        setListaMedicos
    } = useMedicos();

    const [medicoEditando, setMedicoEditando] = useState(null);

    function handleDelete(id) {

        setListaMedicos(

            listaMedicos.filter(
                medico => medico.id !== id
            )

        );

    }

    function handleEdit(medico) {

        setMedicoEditando(medico);

    }

    return (

        <>

            <h1>Médicos</h1>

            <br />

            <MedicoForm
                medicoEditando={medicoEditando}
                setMedicoEditando={setMedicoEditando}
            />

            <br />
            <br />

            <h2>
                Médicos cadastrados
            </h2>

            <br />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px"
                }}
            >

                {listaMedicos.map(medico => (

                    <MedicoCard
                        key={medico.id}
                        medico={medico}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />

                ))}

            </div>

        </>

    );

}

export default Medicos;