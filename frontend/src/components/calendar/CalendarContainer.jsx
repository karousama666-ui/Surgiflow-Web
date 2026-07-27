import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

function CalendarContainer() {

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


                height="auto"

                locale="pt-br"

            />

        </div>

    );

}

export default CalendarContainer;