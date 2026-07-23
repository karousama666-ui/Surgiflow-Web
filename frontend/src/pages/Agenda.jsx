import { useState } from "react";

import cirurgias from "../data/cirurgias";

import AgendaTable from "../components/agenda/AgendaTable";

import SearchBar from "../components/agenda/SearchBar";

function Agenda() {
    
    const [pesquisa, setPesquisa] = useState("");

    const cirurgiasFiltradas = cirurgias.filter((cirurgia) =>
    cirurgia.paciente.toLowerCase().includes(pesquisa.toLowerCase())
    );



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

<br />

            <br />

            <AgendaTable

                cirurgias={cirurgiasFiltradas}


            />

        </>

    )

}

export default Agenda;