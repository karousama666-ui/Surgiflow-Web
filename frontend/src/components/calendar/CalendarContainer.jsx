import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { useCirurgias } from "../../context/CirurgiasContext";
import { useState } from "react";
import CalendarDrawer from "./CalendarDrawer";
import CirurgiaModal from "../modal/CirurgiaModal";


function CalendarContainer() {

    const { listaCirurgias } = useCirurgias();
    const [cirurgiaSelecionada, setCirurgiaSelecionada] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);

    const eventos = listaCirurgias.map((cirurgia) => {

    let data = cirurgia.data;

    // Se estiver em dd/mm/yyyy, converte
    if (data.includes("/")) {

        const [dia, mes, ano] = data.split("/");

        data = `${ano}-${mes}-${dia}`;

    }

    return {

        id: cirurgia.id,

        title: cirurgia.paciente,

        date: data

    };

});

    return (

        <div
            style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,.08)"
            }}
        >

            <FullCalendar

    plugins={[

        dayGridPlugin,

        interactionPlugin

    ]}

    initialView="dayGridMonth"

    locale={ptBrLocale}

    events={eventos}

    height="auto"

    eventClick={(info) => {

    const cirurgia = listaCirurgias.find(

        (c) => c.id == info.event.id

    );

    setCirurgiaSelecionada(cirurgia);

}}

/>

<CalendarDrawer

    cirurgia={cirurgiaSelecionada}

    onClose={() => setCirurgiaSelecionada(null)}

    onEdit={(cirurgia) => {

        setCirurgiaEditando(cirurgia);

        setModalOpen(true);

    }}

/>

<CirurgiaModal

    isOpen={modalOpen}

    onClose={() => {

        setModalOpen(false);

        setCirurgiaEditando(null);

    }}

    cirurgia={cirurgiaEditando}

    onSave={(dados) => {

        // por enquanto só fecha

        setModalOpen(false);

        setCirurgiaEditando(null);

    }}

/>

        </div>

    );

}

export default CalendarContainer;