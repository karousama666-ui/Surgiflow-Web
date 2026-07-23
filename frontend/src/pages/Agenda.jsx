import { useState, useEffect } from "react";
import cirurgias from "../data/cirurgias";

import AgendaTable from "../components/agenda/AgendaTable";

import SearchBar from "../components/agenda/SearchBar";

import Modal from "../components/modal/Modal";

import NovaCirurgiaForm from "../components/modal/NovaCirurgiaForm";

function Agenda() {
    
    const [pesquisa, setPesquisa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
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

onStatusChange={(id,novoStatus)=>{

console.log(id,novoStatus);

}}

/>

            <Modal

    isOpen={modalOpen}

    onClose={() => setModalOpen(false)}

>

    <h2>

        Nova Cirurgia

    </h2>

    <br />

    <NovaCirurgiaForm

    onSave={(dados) => {

    setListaCirurgias([

        ...listaCirurgias,

        dados

    ]);

    setModalOpen(false);

}}

/>

</Modal>

        </>

    )

}

export default Agenda;