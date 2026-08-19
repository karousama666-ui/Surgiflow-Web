import { useState, useEffect } from "react";
import { useMedicos } from "../../context/MedicosContext";
import "./MedicoForm.css";

function MedicoForm({ medicoEditando, setMedicoEditando }) {
  // 1. Aqui nós puxamos as funções corretas do Contexto que salvam no Supabase!
  const { adicionarMedico, editarMedico } = useMedicos();
  
  const [form, setForm] = useState({ nome: "", crm: "", especialidade: "", telefone: "", email: "", hospital: "" });

  useEffect(() => {
    if (medicoEditando) setForm(medicoEditando);
  }, [medicoEditando]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 2. Transformamos o handleSave em assíncrono (async) para esperar o banco de dados
  async function handleSave() {
    if (!form.nome || !form.crm) return alert("Preencha Nome e CRM.");
    
    if (medicoEditando) {
      // Usa a função de editar do Contexto
      await editarMedico(medicoEditando.id, form);
    } else {
      // Usa a função de adicionar do Contexto
      await adicionarMedico(form);
    }
    
    // Limpa o formulário depois de salvar
    setForm({ nome: "", crm: "", especialidade: "", telefone: "", email: "", hospital: "" });
    setMedicoEditando(null);
  }

  return (
    <div className="medico-form-container">
      <h3>{medicoEditando ? "Editar Médico" : "Novo Médico"}</h3>
      <div className="form-grid">
        <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="modern-input" />
        <input name="crm" placeholder="CRM" value={form.crm} onChange={handleChange} className="modern-input" />
        <input name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} className="modern-input" />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="modern-input" />
        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="modern-input" />
        <input name="hospital" placeholder="Hospital principal" value={form.hospital} onChange={handleChange} className="modern-input" />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-save" onClick={handleSave}>
          {medicoEditando ? "Salvar Alterações" : "Cadastrar"}
        </button>
        {medicoEditando && (
          <button className="btn-cancel" onClick={() => { setForm({ nome: "", crm: "", especialidade: "", telefone: "", email: "", hospital: "" }); setMedicoEditando(null); }}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

export default MedicoForm;