import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Calendario from "./pages/Calendario";
import Pedidos from "./pages/Pedidos";

import { Routes, Route } from "react-router-dom";

function App(){

    return (

    <MainLayout>

        <Routes>

            <Route

                path="/"

                element={<Dashboard />}

            />

            <Route

                path="/agenda"

                element={<Agenda />}

            />

            <Route

                path="/calendario"

                element={<Calendario />}

            />

            <Route

    path="/pedidos"

    element={<Pedidos />}

/>

        </Routes>

    </MainLayout>

)

}

export default App;