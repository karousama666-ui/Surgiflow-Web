import "./DashboardCard.css";

function DashboardCard({ title, value }) {

    return (

        <div className="dashboard-card">

            <h2>

                {value}

            </h2>

            <span>

                {title}

            </span>

        </div>

    );

}

export default DashboardCard;