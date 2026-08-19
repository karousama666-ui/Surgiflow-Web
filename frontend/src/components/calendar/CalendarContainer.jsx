import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import { useCirurgias } from "../../context/CirurgiasContext";
import { useMedicos } from "../../context/MedicosContext";
import { useState } from "react";

import CalendarDrawer from "./CalendarDrawer";
import CirurgiaModal from "../modal/CirurgiaModal";
import "./CalendarContainer.css";

function CalendarContainer() {
    const { listaCirurgias, editarCirurgia, excluirCirurgia } = useCirurgias();
    const { listaMedicos } = useMedicos();

    const [cirurgiaSelecionada, setCirurgiaSelecionada] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);

    // Busca o nome do médico já formatado pelo Supabase
    function obterNomeMedico(cirurgia) {
        if (cirurgia.medicos && cirurgia.medicos.nome) {
            return cirurgia.medicos.nome;
        }
        return "Médico não informado";
    }

    // Define a cor do evento com base no status da cirurgia
    function obterCorPorStatus(status) {
        switch (status) {
            case "Confirmada":
                return { background: "#10b981", border: "#10b981" }; // Verde
            case "Pendente":
                return { background: "#f59e0b", border: "#f59e0b" }; // Amarelo/Laranja
            case "Finalizada":
            case "Realizada":
                return { background: "#3b82f6", border: "#3b82f6" }; // Azul
            case "Cancelada":
                return { background: "#ef4444", border: "#ef4444" }; // Vermelho
            default:
                return { background: "#6C63FF", border: "#6C63FF" }; // Roxo padrão SurgiFlow
        }
    }

    // Formata os eventos para o calendário ler certinho
    const eventos = listaCirurgias.map((cirurgia) => {
        // Pega a data exata do Supabase (que vem como "2026-08-19 19:00") e recorta só o dia
        let dataFormatada = "";
        if (cirurgia.data_cirurgia) {
            dataFormatada = cirurgia.data_cirurgia.split(" ")[0]; 
        }

        const cores = obterCorPorStatus(cirurgia.status);

        return {
            id: cirurgia.id,
            title: `${cirurgia.paciente} - ${obterNomeMedico(cirurgia)}`,
            date: dataFormatada,
            backgroundColor: cores.background,
            borderColor: cores.border
        };
    });

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={ptBrLocale}
                events={eventos}
                
                // AS REGRAS QUE SALVAM O LAYOUT!
                height="75vh"
                dayMaxEvents={3} 
                
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                eventClick={(info) => {
                    const cirurgia = listaCirurgias.find(
                        (c) => String(c.id) === String(info.event.id)
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
                onDelete={(id) => {
                    // Exclui no banco!
                    excluirCirurgia(id);
                    setCirurgiaSelecionada(null);
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
                    // Edita no banco!
                    if (cirurgiaEditando) {
                        editarCirurgia(cirurgiaEditando.id, dados);
                    }
                    setModalOpen(false);
                    setCirurgiaEditando(null);
                    setCirurgiaSelecionada(null); 
                }}
            />
        </div>
    );
}

export default CalendarContainer;