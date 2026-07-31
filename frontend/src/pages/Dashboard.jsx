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



function Dashboard(){

    const { listaCirurgias } = useCirurgias();

const hoje = new Date().toISOString().split("T")[0];

const cirurgiasHoje = listaCirurgias.filter(
    cirurgia => cirurgia.data === hoje
);

const pendentes = listaCirurgias.filter(
    cirurgia => cirurgia.status === "Pendente"
);

const confirmadas = listaCirurgias.filter(
    cirurgia => cirurgia.status === "Confirmada"
);

    return(

        <>

           <HeaderDashboard />

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(4,1fr)",
                    gap:"20px"
                }}
            >

                <DashboardCard
    title="Cirurgias"
    value={listaCirurgias.length}
    subtitle="Total cadastradas"
    color="#6C63FF"
    icon={<ClipboardList color="white" size={24}/>}
/>

                <DashboardCard
    title="Hoje"
    value={cirurgiasHoje.length}
    subtitle="Agenda do dia"
    color="#3B82F6"
    icon={<CalendarDays color="white" size={24}/>}
/>

                <DashboardCard
    title="Pendentes"
    value={pendentes.length}
    subtitle="Aguardando confirmação"
    color="#F59E0B"
    icon={<CircleAlert color="white" size={24}/>}
/>

                <DashboardCard
    title="Autorizadas"
    value={confirmadas.length}
    subtitle="Prontas para cirurgia"
    color="#22C55E"
    icon={<CircleCheck color="white" size={24}/>}
/>

            </div>

            <br />
            <br />

            <div
    style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
        marginTop: "30px"
    }}
>

    <AgendaHoje />

    <Lembretes />

</div>

        </>

    )

}

export default Dashboard;