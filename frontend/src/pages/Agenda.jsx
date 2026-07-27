import { useState, useEffect } from "react";
import cirurgias from "../data/cirurgias";

import AgendaTable from "../components/agenda/AgendaTable";

import SearchBar from "../components/agenda/SearchBar";

import Modal from "../components/modal/Modal";

import NovaCirurgiaForm from "../components/modal/NovaCirurgiaForm";

function Agenda() {
    
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);
    const [listaCirurgias, setListaCirurgias] = useState(() => {

    const dadosSalvos = localStorage.getItem("cirurgias");

    if(dadosSalvos){

        return JSON.parse(dadosSalvos);

    }

    return cirurgias;

});

    const cirurgiasFiltradas = listaCirurgias.filter((cirurgia) =>
  cirurgia.paciente.toLowerCase().includes(pesquisa.toLowerCase())
);

useEffect(() => {

    localStorage.setItem(

        "cirurgias",

        JSON.stringify(listaCirurgias)

    );

}, [listaCirurgias]);



    return (

        <>

            <h1>

                Agenda de Cirurgias

            </h1>

            <br />


            <SearchBar

                value={pesquisa}

                onChange={(e) => setPesquisa(e.target.value)}

    />

            <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  }}
>
  <button
    onClick={() => setModalOpen(true)}
    style={{
      background: "#6C63FF",
      color: "#fff",
      border: "none",
      padding: "12px 20px",
      borderRadius: "10px",
      fontWeight: "600",
    }}
  >
    + Nova Cirurgia
  </button>
</div>

<br />

            <br />

            <AgendaTable

    cirurgias={cirurgiasFiltradas}

    onStatusChange={(id, novoStatus) => {

        const novaLista = listaCirurgias.map((cirurgia) => {

            if (cirurgia.id === id) {

                return {

                    ...cirurgia,

                    status: novoStatus

                };

            }

            return cirurgia;

        });

        setListaCirurgias(novaLista);

    }}

    onDelete={(id) => {

        const novaLista = listaCirurgias.filter(

            (cirurgia) => cirurgia.id !== id

        );

        

        setListaCirurgias(novaLista);

    }}

    onEdit={(cirurgia) => {

    setCirurgiaEditando(cirurgia);

    setModalOpen(true);

}}

/>

            <Modal

    isOpen={modalOpen}

    onClose={() => {

        setModalOpen(false);

        setCirurgiaEditando(null);

    }}

>

    <h2>

        {cirurgiaEditando ? "Editar Cirurgia" : "Nova Cirurgia"}

    </h2>

    <br />

    <NovaCirurgiaForm

        dados={cirurgiaEditando}

        onSave={(dados) => {

            if (cirurgiaEditando) {

                const novaLista = listaCirurgias.map((cirurgia) => {

                    if (cirurgia.id === cirurgiaEditando.id) {

                        return {

                            ...dados,

                            id: cirurgia.id

                        };

                    }

                    return cirurgia;

                });

                setListaCirurgias(novaLista);

                setCirurgiaEditando(null);

            } else {

                const novaCirurgia = {

                    id: Date.now(),

                    ...dados,

                    status: "Pendente"

                };

                setListaCirurgias([

                    ...listaCirurgias,

                    novaCirurgia

                ]);

            }

            setModalOpen(false);

        }}

    />

</Modal>

        </>

    )

}

export default Agenda;