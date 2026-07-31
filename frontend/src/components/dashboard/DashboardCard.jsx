import "./DashboardCard.css";

function DashboardCard({

    title,

    value,

    icon,

    color,

    subtitle

}) {

    return (

        <div className="dashboard-card">

            <div
                className="dashboard-card-icon"
                style={{
                    background: color
                }}
            >

                {icon}

            </div>

            <h2>

                {value}

            </h2>

            <span>

                {title}

            </span>

            <small>

                {subtitle}

            </small>

        </div>

    );

}

export default DashboardCard;