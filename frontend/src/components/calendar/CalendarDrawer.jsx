import "./CalendarDrawer.css";
import {
    Stethoscope,
    Building2,
    Calendar,
    Clock3,
    CircleCheck,
    Pencil,
    Trash2,
    FileText
} from "lucide-react";

function CalendarDrawer({
    cirurgia,
    onClose,
    onEdit,
    onDelete
}) {
    if (!cirurgia) return null;

    // 1. ARRUMANDO A DATA E A HORA (Quebrando o formato do Supabase)
    let dataFormatada = "Data não informada";
    let horaFormatada = "Horário não informado";
    
    if (cirurgia.data_cirurgia) {
        const partes = cirurgia.data_cirurgia.split(" ");
        // partes[0] é a data "2026-08-30"
        // partes[1] é a hora "08:00:00"
        
        if (partes[0]) {
            const [ano, mes, dia] = partes[0].split("-");
            dataFormatada = `${dia}/${mes}/${ano}`;
        }
        
        if (partes[1]) {
            // Se vier 08:00:00, pega só os primeiros 5 caracteres (08:00)
            horaFormatada = partes[1].substring(0, 5); 
        }
    }

    // 2. ARRUMANDO O MÉDICO (Puxando a relação da tabela)
    const nomeMedico = (cirurgia.medicos && cirurgia.medicos.nome) 
        ? cirurgia.medicos.nome 
        : "Médico não informado";

    return (
        <div className="calendar-drawer-overlay" onClick={onClose}>
            <aside
                className="calendar-drawer"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="drawer-header">
                    <div className="drawer-avatar">
                        {cirurgia.paciente
                            .split(" ")
                            .map(nome => nome[0])
                            .slice(0,2)
                            .join("")
                        }
                    </div>
                    <div>
                        <h2>{cirurgia.paciente}</h2>
                        <span>Paciente</span>
                    </div>
                </div>

                <hr />

                <div className="drawer-info">
                    <Stethoscope size={20}/>
                    <div>
                        <small>Médico</small>
                        {/* Puxa a variável nova que criamos lá em cima! */}
                        <strong>{nomeMedico}</strong>
                    </div>
                </div>

                <div className="drawer-info">
                    <Building2 size={20}/>
                    <div>
                        <small>Hospital</small>
                        <strong>{cirurgia.hospital || "Não informado"}</strong>
                    </div>
                </div>

                <div className="drawer-info">
                    <FileText size={20}/>
                    <div>
                        <small>Convênio</small>
                        <strong>{cirurgia.convenio || "Não informado"}</strong>
                    </div>
                </div>

                <div className="drawer-info">
                    <Calendar size={20}/>
                    <div>
                        <small>Data</small>
                        {/* Puxa a variável da data formatada! */}
                        <strong>{dataFormatada}</strong>
                    </div>
                </div>

                <div className="drawer-info">
                    <Clock3 size={20}/>
                    <div>
                        <small>Horário</small>
                        {/* Puxa a variável do horário formatado! */}
                        <strong>{horaFormatada}</strong>
                    </div>
                </div>

                <div className="drawer-info">
                    <CircleCheck size={20}/>
                    <div>
                        <small>Status</small>
                        <span className={`status-badge ${cirurgia.status ? cirurgia.status.toLowerCase() : ""}`}>
                            {cirurgia.status || "Pendente"}
                        </span>
                    </div>
                </div>

                <hr />

                <div className="drawer-actions">
                    <button
                        className="drawer-btn primary"
                        onClick={() => {
                            onClose();
                            onEdit(cirurgia);
                        }}
                    >
                        <Pencil size={18}/>
                        Editar
                    </button>
                    
                    <button className="drawer-btn">
                        <FileText size={18}/>
                        Gerar Pedido
                    </button>
                    
                    <button
                        className="drawer-btn danger"
                        onClick={() => {
                            const confirmar = window.confirm(
                                "Deseja realmente excluir esta cirurgia?"
                            );
                            if (confirmar) {
                                onDelete(cirurgia.id);
                            }
                        }}
                    >
                        <Trash2 size={18}/>
                        Excluir
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default CalendarDrawer;