const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
    res.send('Servidor SurgiFlow rodando com sucesso!');
});

app.get('/testar-conexao', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');
        res.json({ mensagem: "Conexão com o Supabase realizada com sucesso! 🎉", horarioBanco: resultado.rows[0].now });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao conectar com o banco.", detalhes: erro.message });
    }
});

// --- MÉDICOS ---
app.post('/cadastrar-medico', async (req, res) => {
    const { nome, crm, especialidade, email, telefone } = req.body;
    try {
        const query = `
            INSERT INTO medicos (nome, crm, especialidade, email, telefone) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        const valores = [nome, crm, especialidade || '', email || '', telefone || ''];
        const novoMedico = await pool.query(query, valores);
        res.json({ mensagem: "Médico cadastrado com sucesso! 🚀", medico: novoMedico.rows[0] });
    } catch (erro) {
        console.error("Erro ao cadastrar médico:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar médico no banco.", detalhes: erro.message });
    }
});

app.get('/medicos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM medicos ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao buscar médicos:", erro);
        res.status(500).json({ erro: "Erro ao buscar médicos." });
    }
});

// --- CIRURGIAS ---
app.post('/cadastrar-cirurgia', async (req, res) => {
    const { paciente, procedimento, medico_id, hospital, convenio, data_cirurgia, status } = req.body;
    try {
        const query = `
            INSERT INTO cirurgias (paciente, procedimento, medico_id, hospital, convenio, data_cirurgia, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const valores = [
            paciente, 
            procedimento || 'Não informado', 
            medico_id ? Number(medico_id) : null, 
            hospital || 'Não informado', 
            convenio || 'Particular',
            String(data_cirurgia), 
            status || 'Pendente'
        ];
        const novaCirurgia = await pool.query(query, valores);
        res.json({ mensagem: "Cirurgia agendada com sucesso! 🏥", cirurgia: novaCirurgia.rows[0] });
    } catch (erro) {
        console.error("Erro ao cadastrar cirurgia:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar cirurgia no banco.", detalhes: erro.message });
    }
});

app.get('/cirurgias', async (req, res) => {
    try {
        const query = `
            SELECT cirurgias.*, medicos.nome as medico_nome 
            FROM cirurgias 
            LEFT JOIN medicos ON cirurgias.medico_id = medicos.id 
            ORDER BY cirurgias.id DESC;
        `;
        const resultado = await pool.query(query);
        
        const cirurgiasFormatadas = resultado.rows.map(c => {
            const partesData = c.data_cirurgia ? c.data_cirurgia.split(' ') : ['', ''];
            return {
                ...c,
                medico: c.medico_nome || "Médico não informado",
                convenio: c.convenio || "Particular",
                data: partesData[0] || "",
                horario: partesData[1] || ""
            };
        });

        res.json(cirurgiasFormatadas);
    } catch (erro) {
        console.error("Erro ao buscar cirurgias:", erro);
        res.status(500).json({ erro: "Erro ao buscar agenda cirúrgica." });
    }
});

app.put('/atualizar-cirurgia/:id', async (req, res) => {
    const { id } = req.params;
    const { paciente, procedimento, medico_id, hospital, convenio, data_cirurgia, status } = req.body;
    try {
        const query = `
            UPDATE cirurgias 
            SET paciente = $1, procedimento = $2, medico_id = $3, hospital = $4, convenio = $5, data_cirurgia = $6, status = $7
            WHERE id = $8 RETURNING *;
        `;
        const valores = [
            paciente, 
            procedimento, 
            medico_id ? Number(medico_id) : null, 
            hospital, 
            convenio,
            String(data_cirurgia), 
            status, 
            id
        ];
        const atualizada = await pool.query(query, valores);
        res.json({ mensagem: "Cirurgia atualizada com sucesso!", cirurgia: atualizada.rows[0] });
    } catch (erro) {
        console.error("Erro ao atualizar cirurgia:", erro);
        res.status(500).json({ erro: "Erro ao atualizar cirurgia." });
    }
});

app.delete('/deletar-cirurgia/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cirurgias WHERE id = $1', [id]);
        res.json({ mensagem: "Cirurgia deletada com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar cirurgia:", erro);
        res.status(500).json({ erro: "Erro ao deletar cirurgia." });
    }
});

// Rota para atualizar médico
app.put('/atualizar-medico/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, crm, especialidade, email, telefone } = req.body;
    try {
        const query = `
            UPDATE medicos 
            SET nome = $1, crm = $2, especialidade = $3, email = $4, telefone = $5 
            WHERE id = $6 RETURNING *;
        `;
        const atualizado = await pool.query(query, [nome, crm, especialidade, email, telefone, id]);
        res.json({ mensagem: "Médico atualizado com sucesso!", medico: atualizado.rows[0] });
    } catch (erro) {
        console.error("Erro ao atualizar médico:", erro);
        res.status(500).json({ erro: "Erro ao atualizar médico no banco." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});