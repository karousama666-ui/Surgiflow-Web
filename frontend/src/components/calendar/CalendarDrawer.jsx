import "./CalendarDrawer.css";

function CalendarDrawer({ cirurgia, onClose }) {

    if (!cirurgia) return null;

    return (

        <div className="calendar-drawer-overlay" onClick={onClose}>

            <aside

                className="calendar-drawer"

                onClick={(e) => e.stopPropagation()}

            >

                <h2>{cirurgia.paciente}</h2>

                <hr />

                <p>

                    <strong>Médico:</strong>

                    {cirurgia.medico}

                </p>

                <p>

                    <strong>Hospital:</strong>

                    {cirurgia.hospital}

                </p>

                <p>

                    <strong>Data:</strong>

                    {cirurgia.data}

                </p>

                <p>

                    <strong>Hora:</strong>

                    {cirurgia.horario}

                </p>

                <p>

                    <strong>Status:</strong>

                    {cirurgia.status}

                </p>

            </aside>

        </div>

    );

}

export default CalendarDrawer;