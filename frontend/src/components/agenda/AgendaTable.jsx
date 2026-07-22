import "./AgendaTable.css";

function AgendaTable({ cirurgias }) {
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
          <th>Data</th>
          <th>Hora</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {cirurgias.map((cirurgia) => (
          <tr key={cirurgia.id}>
            <td>{cirurgia.paciente}</td>
            <td>{cirurgia.medico}</td>
            <td>{cirurgia.hospital}</td>
            <td>{cirurgia.data}</td>
            <td>{cirurgia.horario}</td>
            <td>{cirurgia.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AgendaTable;