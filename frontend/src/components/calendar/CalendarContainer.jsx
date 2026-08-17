import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import { useCirurgias } from "../../context/CirurgiasContext";
import { useMedicos } from "../../context/MedicosContext";

import { useState } from "react";

import CalendarDrawer from "./CalendarDrawer";
import CirurgiaModal from "../modal/CirurgiaModal";


function CalendarContainer() {

    const {

        listaCirurgias,

        setListaCirurgias

    } = useCirurgias();

    const { listaMedicos } = useMedicos();

    const [cirurgiaSelecionada, setCirurgiaSelecionada] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [cirurgiaEditando, setCirurgiaEditando] = useState(null);


    function obterNomeMedico(cirurgia) {

        if (cirurgia.medicoId) {

            const medico = listaMedicos.find(

                medico =>
                    String(medico.id) ===
                    String(cirurgia.medicoId)

            );

            if (medico) {

                return medico.nome;

            }

        }

        return cirurgia.medico || "Médico não informado";

    }


    const eventos = listaCirurgias.map((cirurgia) => {

        let data = cirurgia.data;

        // Se estiver em dd/mm/yyyy, converte
        if (data && data.includes("/")) {

            const [dia, mes, ano] = data.split("/");

            data = `${ano}-${mes}-${dia}`;

        }

        return {

            id: cirurgia.id,

            title: `${cirurgia.paciente} - ${obterNomeMedico(cirurgia)}`,

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

                        (c) =>
                            String(c.id) ===
                            String(info.event.id)

                    );

                    setCirurgiaSelecionada(cirurgia);

                }}

            />


            <CalendarDrawer

                cirurgia={cirurgiaSelecionada}

                onClose={() =>
                    setCirurgiaSelecionada(null)
                }

                onEdit={(cirurgia) => {

                    setCirurgiaEditando(cirurgia);

                    setModalOpen(true);

                }}

                onDelete={(id) => {

                    const novaLista =
                        listaCirurgias.filter(

                            (cirurgia) =>
                                cirurgia.id !== id

                        );

                    setListaCirurgias(novaLista);

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

                    if (!cirurgiaEditando) {

                        return;

                    }

                    const novaLista =
                        listaCirurgias.map(

                            (cirurgia) => {

                                if (
                                    cirurgia.id ===
                                    cirurgiaEditando.id
                                ) {

                                    return {

                                        ...cirurgia,

                                        ...dados,

                                        id: cirurgia.id

                                    };

                                }

                                return cirurgia;

                            }

                        );

                    setListaCirurgias(novaLista);

                    setModalOpen(false);

                    setCirurgiaEditando(null);

                    setCirurgiaSelecionada(null);

                }}

            />

        </div>

    );

}

export default CalendarContainer;