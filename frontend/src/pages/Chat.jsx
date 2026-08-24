import React, { useState } from 'react';
import { Send, Paperclip, Search, Plus, User, Info } from 'lucide-react';

function Chat() {
  const [mensagem, setMensagem] = useState('');

  // Dados mockados apenas para vermos o visual
  const [contatos] = useState([
    { id: 1, nome: "Dr. Murilo Pinheiro", surgitag: "Murilo#8249", especialidade: "Ortopedia", online: true },
    { id: 2, nome: "Dra. Angelica Krusin", surgitag: "Angelica#1024", especialidade: "Neurocirurgia", online: false },
  ]);

  const [mensagens] = useState([
    { id: 1, sender: 'other', text: 'Bom dia! Consegue me enviar o POP daquela cirurgia de amanhã?', time: '09:00' },
    { id: 2, sender: 'me', text: 'Bom dia, Dr! Claro, estou anexando aqui.', time: '09:05' },
    { id: 3, sender: 'me', text: '📎 POP_Higienizacao_RDC665.pdf', isAttachment: true, time: '09:06' },
  ]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      
      {/* 🔴 BARRA LATERAL (CONTATOS) 🔴 */}
      <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        
        {/* Cabeçalho de Contatos */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: '700' }}>Equipe</h2>
            <button style={{ background: '#6C63FF', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Adicionar Contato (SurgiTag)">
              <Plus size={18} />
            </button>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Buscar pela SurgiTag..." style={{ width: '100%', padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }} />
          </div>
        </div>

        {/* Lista de Contatos */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contatos.map(contato => (
            <div key={contato.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: contato.id === 1 ? '#eff6ff' : 'transparent', transition: '0.2s' }}>
              <div style={{ position: 'relative', marginRight: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="#64748b" />
                </div>
                {contato.online && <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', position: 'absolute', bottom: '0', right: '0', border: '2px solid white' }}></span>}
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', color: '#1e293b' }}>{contato.nome}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6C63FF', fontWeight: '600' }}>{contato.surgitag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔴 ÁREA PRINCIPAL (CHAT) 🔴 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Cabeçalho do Chat Ativo */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Dr. Murilo Pinheiro</h3>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '12px', fontWeight: '600' }}>Ortopedia</span>
          </div>
          <Info size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
        </div>

        {/* Área de Mensagens */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <span style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>HOJE</span>
          </div>
          
          {mensagens.map(msg => (
            <div key={msg.id} style={{ alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
              <div style={{
                background: msg.sender === 'me' ? '#6C63FF' : 'white',
                color: msg.sender === 'me' ? 'white' : '#334155',
                padding: '12px 16px',
                borderRadius: msg.sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: msg.sender === 'me' ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {msg.isAttachment ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><Paperclip size={16} /></div>
                    <span style={{ fontWeight: '600', textDecoration: 'underline' }}>{msg.text.replace('📎 ', '')}</span>
                  </div>
                ) : msg.text}
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', display: 'block', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Barra de Digitação */}
        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '8px 15px', borderRadius: '24px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }} title="Anexar Documento">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Digite sua mensagem..." 
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1e293b' }} 
            />
            <button style={{ background: '#6C63FF', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;