import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import { useCirurgias } from "../../context/CirurgiasContext";
import { useMedicos } from "../../context/MedicosContext";
import { useState } from "react";

import CirurgiaModal from "../modal/CirurgiaModal"; // 👈 NOSSO NOVO MODAL OUTLOOK!
import "./CalendarContainer.css";

function CalendarContainer() {
    const { listaCirurgias, editarCirurgia, excluirCirurgia } = useCirurgias();
    const { listaMedicos } = useMedicos();

    const [modalOpen, setModalOpen] = useState(false);
    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);

    // Busca o nome do médico já formatado pelo Supabase
    function obterNomeMedico(cirurgia) {
        if (cirurgia.medicos && cirurgia.medicos.nome) {
            return cirurgia.medicos.nome;
        }
        return "Médico não informado";
    }

    // Define a cor do evento com base no status da cirurgia (Cores mais suaves estilo Microsoft)
    function obterCorPorStatus(status) {
        switch (status) {
            case "Confirmada":
                return { background: "#107c41", border: "#107c41" }; // Verde Microsoft
            case "Pendente":
                return { background: "#d83b01", border: "#d83b01" }; // Laranja Microsoft
            case "Finalizada":
            case "Realizada":
                return { background: "#64748b", border: "#64748b" }; // Cinza Neutro
            case "Cancelada":
                return { background: "#a4262c", border: "#a4262c" }; // Vermelho Microsoft
            default:
                return { background: "#0078d4", border: "#0078d4" }; // Azul Outlook
        }
    }

    // Formata os eventos para o calendário ler certinho
    const eventos = listaCirurgias.map((cirurgia) => {
        let dataFormatada = "";
        let horaFormatada = "";
        
        if (cirurgia.data_cirurgia) {
            const partes = cirurgia.data_cirurgia.split(" ");
            dataFormatada = partes[0]; 
            if(partes[1]) {
                const tempoPartes = partes[1].split(":");
                horaFormatada = `${tempoPartes[0]}:${tempoPartes[1]}`;
            }
        }

        const cores = obterCorPorStatus(cirurgia.status);

        return {
            id: cirurgia.id,
            title: `${horaFormatada ? horaFormatada + ' - ' : ''}${cirurgia.paciente}`,
            date: dataFormatada,
            backgroundColor: cores.background,
            borderColor: cores.border,
            textColor: "#ffffff",
            extendedProps: { medico: obterNomeMedico(cirurgia) }
        };
    });

    return (
        <div className="calendar-wrapper" style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0" }}>
            
            {/* 🌟 INJETANDO UM POUCO DE CSS ESTILO OUTLOOK DIRETO NO REACT 🌟 */}
            <style>{`
                .fc-theme-standard .fc-scrollgrid { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
                .fc .fc-toolbar-title { font-size: 1.3rem !important; font-weight: 700; color: #1e293b; text-transform: capitalize; }
                .fc .fc-button-primary { background-color: #f8fafc !important; border-color: #cbd5e1 !important; color: #334155 !important; text-transform: capitalize; font-weight: 600; box-shadow: none !important; transition: 0.2s; }
                .fc .fc-button-primary:hover { background-color: #e2e8f0 !important; color: #0f172a !important; }
                .fc .fc-button-active { background-color: #0078d4 !important; border-color: #0078d4 !important; color: white !important; }
                .fc .fc-daygrid-day-number { color: #475569; font-weight: 500; padding: 8px; }
                .fc .fc-col-header-cell-cushion { padding: 12px 0; color: #64748b; font-weight: 600; }
                .fc-day-today { background-color: #f0f6ff !important; } /* Azul clarinho para o dia de hoje */
                .fc-event { border-radius: 4px; padding: 2px 4px; font-size: 0.8rem; cursor: pointer; transition: transform 0.1s; }
                .fc-event:hover { transform: scale(1.02); z-index: 5; }
            `}</style>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={ptBrLocale}
                events={eventos}
                height="75vh"
                dayMaxEvents={4} 
                
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                
                // 🌟 A MÁGICA: QUANDO CLICAR, ABRE O MODAL DIRETO!
                eventClick={(info) => {
                    const cirurgia = listaCirurgias.find(
                        (c) => String(c.id) === String(info.event.id)
                    );
                    setCirurgiaEditando(cirurgia);
                    setModalOpen(true); // 👈 ABRE O MODAL OUTLOOK NA CARA DO GOL!
                }}
                
                // Formatação personalizada de como o texto aparece no bloquinho
                eventContent={(arg) => {
                    return (
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <b>{arg.event.title.split(' - ')[0]}</b> {arg.event.title.split(' - ')[1]}
                        </div>
                    );
                }}
            />

            {/* O NOSSO NOVO MODAL PREMIUM */}
            <CirurgiaModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setCirurgiaEditando(null);
                }}
                cirurgia={cirurgiaEditando}
                onSave={(dados) => {
                    if (cirurgiaEditando) {
                        editarCirurgia(cirurgiaEditando.id, dados);
                    }
                    setModalOpen(false);
                    setCirurgiaEditando(null);
                }}
            />
        </div>
    );
}

export default CalendarContainer;