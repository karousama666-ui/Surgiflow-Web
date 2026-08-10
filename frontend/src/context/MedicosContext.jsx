import { createContext, useContext, useState, useEffect } from "react";

const MedicosContext = createContext();

export function MedicosProvider({ children }) {

    const [listaMedicos, setListaMedicos] = useState(() => {

        const dadosSalvos = localStorage.getItem("medicos");

        if (dadosSalvos) {

            return JSON.parse(dadosSalvos);

        }

        return [];

    });

    useEffect(() => {

        localStorage.setItem(

            "medicos",

            JSON.stringify(listaMedicos)

        );

    }, [listaMedicos]);

    return (

        <MedicosContext.Provider

            value={{

                listaMedicos,

                setListaMedicos

            }}

        >

            {children}

        </MedicosContext.Provider>

    );

}

export function useMedicos() {

    return useContext(MedicosContext);

}