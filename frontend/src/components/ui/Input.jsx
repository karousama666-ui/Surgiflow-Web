import "./Input.css";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

function Input({ icon: Icon, type, ...props }) {

    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (

        <div className="input-container">

            {Icon && (

                <Icon
                    size={20}
                    className="input-icon"
                />

            )}

            <input

                className="input"

                type={

                type === "password"

                    ? mostrarSenha

                    ? "text"

                    : "password"

                    : type

        }

        {...props}

/>

{type === "password" && (

    <button

        type="button"

        className="eye-button"

        onClick={() =>

            setMostrarSenha(!mostrarSenha)

        }

    >

        {

            mostrarSenha

                ? <EyeOff size={18}/>

                : <Eye size={18}/>

        }

    </button>

)}



        </div>

    )

}

export default Input;