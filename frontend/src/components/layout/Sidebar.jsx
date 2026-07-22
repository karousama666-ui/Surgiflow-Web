import "./Sidebar.css";

import Logo from "./Logo";

import {
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    Users,
    Building2,
    FileText,
    Settings
} from "lucide-react";

function Sidebar() {

    return (

        <aside className="sidebar">

            <Logo />

            <nav>

                <a href="#">
                    <LayoutDashboard size={20}/>
                    Dashboard
                </a>

                <a href="#">
                    <CalendarDays size={20}/>
                    Agenda
                </a>

                <a href="#">
                    <Stethoscope size={20}/>
                    Nova Cirurgia
                </a>

                <a href="#">
                    <Users size={20}/>
                    Médicos
                </a>

                <a href="#">
                    <Building2 size={20}/>
                    Hospitais
                </a>

                <a href="#">
                    <FileText size={20}/>
                    Relatórios
                </a>

                <a href="#">
                    <Settings size={20}/>
                    Configurações
                </a>

            </nav>

            <div className="profile">

                <strong>Carolina Ramos</strong>

                <span>Biomédica</span>

            </div>

        </aside>

    )

}

export default Sidebar;