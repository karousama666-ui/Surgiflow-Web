import DashboardCard from "../components/dashboard/DashboardCard";
import AgendaHoje from "../components/dashboard/AgendaHoje";
import Lembretes from "../components/dashboard/Lembretes";
import HeaderDashboard from "../components/dashboard/HeaderDashboard";

import { useCirurgias } from "../context/CirurgiasContext";

import {
    ClipboardList,
    CalendarDays,
    CircleAlert,
    CircleCheck
} from "lucide-react";

import "./Dashboard.css";


function Dashboard() {

    const { listaCirurgias } = useCirurgias();


    const hoje = new Date()
        .toISOString()
        .split("T")[0];


    const cirurgiasHoje = listaCirurgias.filter(

        cirurgia => {

            if (cirurgia.data === hoje) {

                return true;

            }

            if (cirurgia.data?.includes("/")) {

                const [dia, mes, ano] =
                    cirurgia.data.split("/");

                return `${ano}-${mes}-${dia}` === hoje;

            }

            return false;

        }

    );


    const pendentes = listaCirurgias.filter(

        cirurgia =>
            cirurgia.status === "Pendente"

    );


    const confirmadas = listaCirurgias.filter(

        cirurgia =>
            cirurgia.status === "Confirmada"

    );


    return (

        <div className="dashboard">

            <HeaderDashboard />


            <div className="dashboard-cards">

                <DashboardCard

                    title="Cirurgias"

                    value={listaCirurgias.length}

                    subtitle="Total cadastradas"

                    color="#6C63FF"

                    icon={
                        <ClipboardList
                            color="white"
                            size={24}
                        />
                    }

                />


                <DashboardCard

                    title="Hoje"

                    value={cirurgiasHoje.length}

                    subtitle="Agenda do dia"

                    color="#3B82F6"

                    icon={
                        <CalendarDays
                            color="white"
                            size={24}
                        />
                    }

                />


                <DashboardCard

                    title="Pendentes"

                    value={pendentes.length}

                    subtitle="Aguardando confirmação"

                    color="#F59E0B"

                    icon={
                        <CircleAlert
                            color="white"
                            size={24}
                        />
                    }

                />


                <DashboardCard

                    title="Autorizadas"

                    value={confirmadas.length}

                    subtitle="Prontas para cirurgia"

                    color="#22C55E"

                    icon={
                        <CircleCheck
                            color="white"
                            size={24}
                        />
                    }

                />

            </div>


            <div className="dashboard-content">

                <AgendaHoje />

                <Lembretes />

            </div>

        </div>

    );

}


export default Dashboard;