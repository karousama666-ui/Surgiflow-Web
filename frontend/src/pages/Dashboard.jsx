import DashboardCard from "../components/dashboard/DashboardCard";

function Dashboard(){

    return(

        <>

            <h1>

                Dashboard

            </h1>

            <br />

            <div
                style={{

                    display:"grid",

                    gridTemplateColumns:"repeat(4,1fr)",

                    gap:"20px"

                }}
            >

                <DashboardCard

                    title="Cirurgias"

                    value="12"

                />

                <DashboardCard

                    title="Hoje"

                    value="8"

                />

                <DashboardCard

                    title="Pendentes"

                    value="5"

                />

                <DashboardCard

                    title="Autorizadas"

                    value="17"

                />

            </div>

        </>

    )

}

export default Dashboard;