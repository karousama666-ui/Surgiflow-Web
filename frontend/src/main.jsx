import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CirurgiasProvider } from "./context/CirurgiasContext";
import { MedicosProvider } from "./context/MedicosContext";

import App from "./App";

import "./styles/globals.css";
import "./styles/variables.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <BrowserRouter>

            <CirurgiasProvider>

    <MedicosProvider>

        <App />

    </MedicosProvider>

</CirurgiasProvider>

        </BrowserRouter>

    </React.StrictMode>

);