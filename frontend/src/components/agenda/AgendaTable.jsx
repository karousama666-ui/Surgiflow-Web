import "./AgendaTable.css";
import { Pencil, Trash2 } from "lucide-react";

function AgendaTable({

    cirurgias,

    onStatusChange,

    onDelete,

    onEdit

}) {

    function formatarData(data) {

        if (!data) return "";

        if (data.includes("/")) {

            return data;

        }

        const [ano, mes, dia] = data.split("-");

        return `${dia}/${mes}/${ano}`;

    }

    return (

        <table

            style={{

                width: "100%",

                borderCollapse: "collapse",

                background: "#fff",

                borderRadius: "16px",

                overflow: "hidden",

            }}

        >

            <thead>

                <tr

                    style={{

                        background: "#EEF2FF",

                    }}

                >

                    <th>Paciente</th>

                    <th>Médico</th>

                    <th>Hospital</th>
                    
                    <th>Convênio</th>

                    <th>Data</th>

                    <th>Hora</th>

                    <th>Status</th>

                    <th>Ações</th>

                </tr>

            </thead>

            <tbody>

                {cirurgias.map((cirurgia) => (

                    <tr key={cirurgia.id}>

                        <td>{cirurgia.paciente}</td>

                        <td>{cirurgia.medico}</td>

                        <td>{cirurgia.hospital}</td>

                        <td>{cirurgia.convenio}</td>

                        <td>{formatarData(cirurgia.data)}</td>

                        <td>{cirurgia.horario}</td>

                        <td>

                            <select

                                value={cirurgia.status}

                                onChange={(e) =>

                                    onStatusChange(

                                        cirurgia.id,

                                        e.target.value

                                    )

                                }

                            >

                                <option>Pendente</option>

                                <option>Confirmada</option>

                                <option>Finalizada</option>

                                <option>Cancelada</option>

                            </select>

                        </td>

                        <td>

                            <div

style={{

display:"flex",

gap:"10px",

justifyContent:"center"

}}

>

<button

onClick={() => onEdit(cirurgia)}

style={{

background:"#EEF2FF",

border:"none",

padding:"8px",

borderRadius:"8px",

cursor:"pointer"

}}

>

<Pencil

size={18}

/>

</button>

<button

onClick={() => onDelete(cirurgia.id)}

style={{

background:"#FEE2E2",

border:"none",

padding:"8px",

borderRadius:"8px",

cursor:"pointer"

}}

>

<Trash2

size={18}

color="#DC2626"

/>

</button>

</div>

                            

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}

export default AgendaTable;