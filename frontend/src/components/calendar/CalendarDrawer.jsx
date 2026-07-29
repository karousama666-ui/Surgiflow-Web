import "./CalendarDrawer.css";

import {

    Stethoscope,

    Building2,

    Calendar,

    Clock3,

    CircleCheck,

    Paperclip

} from "lucide-react";

function CalendarDrawer({

    cirurgia,

    onClose,

    onEdit

}) {

    if (!cirurgia) return null;

    return (

        <div className="calendar-drawer-overlay" onClick={onClose}>

            <aside

                className="calendar-drawer"

                onClick={(e) => e.stopPropagation()}

            >

                <div className="drawer-header">

    <div className="drawer-avatar">

        {cirurgia.paciente
            .split(" ")
            .map(nome => nome[0])
            .slice(0,2)
            .join("")
        }

    </div>

    <div>

        <h2>{cirurgia.paciente}</h2>

        <span>Paciente</span>

    </div>

</div>

<hr />

                <hr />

                <div className="drawer-info">

    <Stethoscope size={20}/>

    <div>

        <small>Médico</small>

        <strong>{cirurgia.medico}</strong>

    </div>

</div>

<div className="drawer-info">

    <Building2 size={20}/>

    <div>

        <small>Hospital</small>

        <strong>{cirurgia.hospital}</strong>

    </div>

</div>

<div className="drawer-info">

    <Calendar size={20}/>

    <div>

        <small>Data</small>

        <strong>{cirurgia.data}</strong>

    </div>

</div>

<div className="drawer-info">

    <Clock3 size={20}/>

    <div>

        <small>Horário</small>

        <strong>{cirurgia.horario}</strong>

    </div>

</div>

<div className="drawer-info">

    <CircleCheck size={20}/>

    <div>

        <small>Status</small>

        <span

            className={`status-badge ${cirurgia.status.toLowerCase()}`}

        >

            {cirurgia.status}

        </span>

    </div>

</div>

                <hr />

<div
    style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px"
    }}
>

    <button

        onClick={() => {

    onClose();

    onEdit(cirurgia);

}}

        style={{

            flex: 1,

            background: "#6C63FF",

            color: "#fff",

            border: "none",

            padding: "12px",

            borderRadius: "10px",

            cursor: "pointer"

        }}

    >

        ✏ Editar

    </button>

</div>

            </aside>

        </div>

    );

}

export default CalendarDrawer;