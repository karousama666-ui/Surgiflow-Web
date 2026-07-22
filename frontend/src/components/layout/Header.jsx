import "./Header.css";

import { Bell } from "lucide-react";

function Header(){

    return(

        <header className="header">

            <div>

                <h2>Boa tarde, Carolina 👋</h2>

                <span>Dashboard</span>

            </div>

            <button className="notification">

                <Bell size={22}/>

            </button>

        </header>

    )

}

export default Header;