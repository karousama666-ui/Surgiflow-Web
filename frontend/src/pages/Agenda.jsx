import cirurgias from "../data/cirurgias";

import AgendaTable from "../components/agenda/AgendaTable";

function Agenda() {

    return (

        <>

            <h1>

                Agenda de Cirurgias

            </h1>

            <br />

            <AgendaTable

                cirurgias={cirurgias}

            />

        </>

    )

}

export default Agenda;