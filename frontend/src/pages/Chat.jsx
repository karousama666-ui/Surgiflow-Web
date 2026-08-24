import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search, Plus, User, Info } from 'lucide-react';
import { supabase } from '../services/supabase'; // Conexão com o banco
import { useAuth } from '../context/AuthContext'; // Pega quem está logado

function Chat() {
  const { usuario } = useAuth(); // Pega o usuário logado
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [chatAtivoId, setChatAtivoId] = useState(null);
  const mensagensFimRef = useRef(null);

  // Dados mockados da barra lateral (podemos puxar do banco depois)
  const [contatos] = useState([
    { id: 1, nome: "Mural da Clínica", surgitag: "Geral", especialidade: "Todos", online: true },
  ]);

  // Rola para baixo automático
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // 🚀 O CÉREBRO DO CHAT (Carrega e escuta em tempo real)
  useEffect(() => {
    if (!usuario) return;

    let inscricaoRealtime;

    const inicializarChat = async () => {
      try {
        // 1. Garante que quem está logado tem um perfil/SurgiTag na tabela 'profiles'
        let { data: perfil } = await supabase.from('profiles').select('*').eq('id', usuario.id).single();
        if (!perfil) {
          const primeiroNome = usuario.email.split('@')[0];
          const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
          await supabase.from('profiles').insert([{ 
            id: usuario.id, 
            surgitag: `${primeiroNome}#${numeroAleatorio}`,
            nome_completo: primeiroNome
          }]);
        }

        // 2. Garante que exista pelo menos um "Chat Geral" criado na tabela 'chats'
        let { data: chatRoom } = await supabase.from('chats').select('*').limit(1).single();
        if (!chatRoom) {
          const { data: newChat } = await supabase.from('chats').insert([{}]).select().single();
          chatRoom = newChat;
        }
        setChatAtivoId(chatRoom.id);

        // 3. Busca o histórico de mensagens desse chat
        const { data: historico } = await supabase
          .from('mensagens')
          .select('*, profiles(nome_completo, surgitag)')
          .eq('chat_id', chatRoom.id)
          .order('enviada_em', { ascending: true });
        
        if (historico) setMensagens(historico);

        // 4. A MAGIA ACONTECE AQUI: Escuta mensagens novas em TEMPO REAL!
        inscricaoRealtime = supabase.channel('chat_publico')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `chat_id=eq.${chatRoom.id}` }, 
          async (payload) => {
            // Quando chega mensagem nova, busca quem mandou para pegar o nome
            const { data: sender } = await supabase.from('profiles').select('nome_completo, surgitag').eq('id', payload.new.sender_id).single();
            const novaMensagem = { ...payload.new, profiles: sender };
            
            // Adiciona na tela
            setMensagens((prev) => [...prev, novaMensagem]);
          }).subscribe();

      } catch (error) {
        console.error("Erro ao inicializar chat:", error);
      }
    };

    inicializarChat();

    // Limpa a escuta quando o usuário sai da tela
    return () => {
      if (inscricaoRealtime) supabase.removeChannel(inscricaoRealtime);
    };
  }, [usuario]);

  // 🚀 LÓGICA DE ENVIAR MENSAGEM PARA O BANCO
  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (mensagem.trim() === '' || !chatAtivoId || !usuario) return;

    const textoEnviado = mensagem;
    setMensagem(''); // Limpa a barra rápido pra ficar fluido

    // Salva no Supabase (o Realtime vai avisar todo mundo, inclusive a gente mesmo, que a mensagem chegou)
    await supabase.from('mensagens').insert([{
      chat_id: chatAtivoId,
      sender_id: usuario.id,
      conteudo: textoEnviado
    }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEnviarMensagem(e);
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '600px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      
      {/* 🔴 BARRA LATERAL */}
      <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: '700' }}>Equipe</h2>
            <button style={{ background: '#6C63FF', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Buscar pela SurgiTag..." style={{ width: '100%', padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contatos.map(contato => (
            <div key={contato.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: contato.id === 1 ? '#eff6ff' : 'transparent' }}>
              <div style={{ position: 'relative', marginRight: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#64748b" /></div>
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

      {/* 🔴 ÁREA DO CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Mural da Clínica</h3>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '12px', fontWeight: '600' }}>Geral</span>
          </div>
          <Info size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <span style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>HOJE</span>
          </div>
          
          {mensagens.map(msg => {
            const isMe = msg.sender_id === usuario?.id;
            
            // Pega a hora formatada bonitinha do banco de dados
            const hora = new Date(msg.enviada_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
                {/* Nome de quem enviou (só mostra se não for você) */}
                {!isMe && <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '4px', marginBottom: '4px', display: 'block', fontWeight: '600' }}>{msg.profiles?.nome_completo || 'Usuário'}</span>}
                
                <div style={{
                  background: isMe ? '#6C63FF' : 'white',
                  color: isMe ? 'white' : '#334155',
                  padding: '12px 16px',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: isMe ? 'none' : '1px solid #e2e8f0',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {msg.anexo_url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><Paperclip size={16} /></div>
                      <span style={{ fontWeight: '600', textDecoration: 'underline' }}>Anexo enviado</span>
                    </div>
                  ) : msg.conteudo}
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', display: 'block', textAlign: isMe ? 'right' : 'left' }}>{hora}</span>
              </div>
            );
          })}
          <div ref={mensagensFimRef} />
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '8px 15px', borderRadius: '24px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Digite sua mensagem..." 
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1e293b' }} 
            />
            <button onClick={handleEnviarMensagem} style={{ background: '#6C63FF', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;