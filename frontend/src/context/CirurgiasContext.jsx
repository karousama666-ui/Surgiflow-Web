import { createContext, useContext, useState, useEffect } from "react";

const CirurgiasContext = createContext();

export function CirurgiasProvider({ children }) {

    const [listaCirurgias, setListaCirurgias] = useState(() => {

    const dadosSalvos = localStorage.getItem("cirurgias");

    if (dadosSalvos) {

        return JSON.parse(dadosSalvos);

    }

    return [];

});

useEffect(() => {

    localStorage.setItem(

        "cirurgias",

        JSON.stringify(listaCirurgias)

    );

}, [listaCirurgias]);

    return (

        <CirurgiasContext.Provider

            value={{

                listaCirurgias,

                setListaCirurgias

            }}

        >

            {children}

        </CirurgiasContext.Provider>

    );

}

export function useCirurgias() {

    return useContext(CirurgiasContext);

}