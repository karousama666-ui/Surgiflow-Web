import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search, Plus, User, Info, X, Check } from 'lucide-react';
import { supabase } from '../services/supabase'; 
import { useAuth } from '../context/AuthContext'; 

function Chat() {
  const { usuario } = useAuth(); 
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  
  // Estados para gerenciar as conversas
  const [contatos, setContatos] = useState([]);
  const [chatAtivoId, setChatAtivoId] = useState(null);
  const [contatoAtivo, setContatoAtivo] = useState(null);
  const [meuPerfil, setMeuPerfil] = useState(null);

  // Estados do Modal de Busca de SurgiTag
  const [modalAberto, setModalAberto] = useState(false);
  const [buscaTag, setBuscaTag] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [erroBusca, setErroBusca] = useState('');
  const [loadingBusca, setLoadingBusca] = useState(false);

  const mensagensFimRef = useRef(null);

  // Rola para baixo automático ao receber mensagem
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // 1️⃣ CARREGAMENTO INICIAL (Minha SurgiTag e Meus Contatos)
  useEffect(() => {
    if (!usuario) return;

    const inicializar = async () => {
      // Garante que eu tenho um perfil/SurgiTag
      let { data: perfil } = await supabase.from('profiles').select('*').eq('id', usuario.id).single();
      if (!perfil) {
        const primeiroNome = usuario.email.split('@')[0];
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        const { data: novoPerfil } = await supabase.from('profiles').insert([{ 
          id: usuario.id, 
          surgitag: `${primeiroNome}#${numeroAleatorio}`,
          nome_completo: primeiroNome
        }]).select().single();
        perfil = novoPerfil;
      }
      setMeuPerfil(perfil);
      carregarListaDeContatos();
    };

    inicializar();
  }, [usuario]);

  // 2️⃣ FUNÇÃO PARA CARREGAR A BARRA LATERAL (Quem eu já converso)
  const carregarListaDeContatos = async () => {
    // Acha todas as salas de chat que eu estou dentro
    const { data: meusChats } = await supabase.from('chat_participantes').select('chat_id').eq('user_id', usuario.id);
    if (!meusChats || meusChats.length === 0) return;

    const chatIds = meusChats.map(c => c.chat_id);

    // Acha as outras pessoas que estão nessas mesmas salas
    const { data: outrosParticipantes } = await supabase
      .from('chat_participantes')
      .select('chat_id, profiles(id, nome_completo, surgitag)')
      .in('chat_id', chatIds)
      .neq('user_id', usuario.id); // Pega todo mundo que NÃO sou eu

    if (outrosParticipantes) {
      const listaFormatada = outrosParticipantes.map(p => ({
        chat_id: p.chat_id,
        id: p.profiles.id,
        nome: p.profiles.nome_completo,
        surgitag: p.profiles.surgitag
      }));
      setContatos(listaFormatada);
    }
  };

  // 3️⃣ BUSCAR UM USUÁRIO PELA SURGITAG (O Radar)
  const handleBuscarSurgitag = async () => {
    if (!buscaTag.includes('#')) {
      setErroBusca('A SurgiTag precisa ter um # (Ex: Carolina#1234)');
      return;
    }

    setLoadingBusca(true);
    setErroBusca('');
    setResultadoBusca(null);

    const { data, error } = await supabase.from('profiles').select('*').eq('surgitag', buscaTag.trim()).single();

    if (error || !data) {
      setErroBusca('Nenhum usuário encontrado com essa SurgiTag.');
    } else if (data.id === usuario.id) {
      setErroBusca('Você não pode adicionar a si mesmo.');
    } else {
      setResultadoBusca(data);
    }
    setLoadingBusca(false);
  };

  // 4️⃣ ADICIONAR O CONTATO E CRIAR A SALA DE CHAT
  const handleAdicionarContato = async () => {
    if (!resultadoBusca) return;

    // Cria a sala vazia
    const { data: novoChat } = await supabase.from('chats').insert([{}]).select().single();

    // Coloca eu e o colega dentro da sala
    await supabase.from('chat_participantes').insert([
      { chat_id: novoChat.id, user_id: usuario.id },
      { chat_id: novoChat.id, user_id: resultadoBusca.id }
    ]);

    // Limpa o modal e atualiza a barra lateral
    setModalAberto(false);
    setBuscaTag('');
    setResultadoBusca(null);
    carregarListaDeContatos();
    
    // Já abre o chat novo
    abrirChat(novoChat.id, { nome: resultadoBusca.nome_completo, surgitag: resultadoBusca.surgitag });
  };

  // 5️⃣ ABRIR UM CHAT E OUVIR MENSAGENS EM TEMPO REAL
  const abrirChat = async (idDoChat, dadosDoContato) => {
    setChatAtivoId(idDoChat);
    setContatoAtivo(dadosDoContato);
    
    // Busca o histórico
    const { data: historico } = await supabase
      .from('mensagens')
      .select('*, profiles(nome_completo)')
      .eq('chat_id', idDoChat)
      .order('enviada_em', { ascending: true });
    
    setMensagens(historico || []);

    // Se já tinha um canal aberto ouvindo outro chat, remove ele
    supabase.removeAllChannels();

    // Começa a ouvir o novo chat
    supabase.channel(`sala_${idDoChat}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `chat_id=eq.${idDoChat}` }, 
      async (payload) => {
        const { data: sender } = await supabase.from('profiles').select('nome_completo').eq('id', payload.new.sender_id).single();
        setMensagens((prev) => [...prev, { ...payload.new, profiles: sender }]);
      }).subscribe();
  };

  // 6️⃣ ENVIAR MENSAGEM
  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (mensagem.trim() === '' || !chatAtivoId) return;

    const textoEnviado = mensagem;
    setMensagem(''); 

    await supabase.from('mensagens').insert([{
      chat_id: chatAtivoId,
      sender_id: usuario.id,
      conteudo: textoEnviado
    }]);
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '600px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' }}>
      
      {/* ========================================================== */}
      {/* MODAL DE ADICIONAR CONTATO (Sobrepõe a tela quando aberto) */}
      {/* ========================================================== */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Adicionar à Equipe</h3>
              <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setModalAberto(false)} />
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>Digite a SurgiTag única do profissional que deseja adicionar (Ex: Carolina#8249).</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="text" 
                value={buscaTag}
                onChange={(e) => setBuscaTag(e.target.value)}
                placeholder="Ex: Murilo#1024"
                style={{ 
                  flex: 1, 
                  boxSizing: 'border-box', // 👈 Consertado aqui também!
                  padding: '10px 15px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  outline: 'none' 
                }}
              />
              <button onClick={handleBuscarSurgitag} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                {loadingBusca ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {erroBusca && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0 0 15px 0' }}>{erroBusca}</p>}

            {resultadoBusca && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#64748b" /></div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', color: '#1e293b', fontSize: '0.95rem' }}>{resultadoBusca.nome_completo}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#6C63FF', fontWeight: '600' }}>{resultadoBusca.surgitag}</span>
                  </div>
                </div>
                <button onClick={handleAdicionarContato} style={{ background: '#10b981', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 🔴 BARRA LATERAL (CONTATOS) */}
      <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1e293b', fontWeight: '700' }}>Equipe</h2>
              {/* Mostra a SUA SurgiTag para você copiar e mandar pros outros */}
              {meuPerfil && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Minha Tag: <strong style={{ color: '#6C63FF', userSelect: 'all' }}>{meuPerfil.surgitag}</strong></span>}
            </div>
            
            {/* O BOTÃO DE ABRIR O RADAR (+) */}
            <button onClick={() => setModalAberto(true)} style={{ background: '#6C63FF', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Plus size={18} />
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Filtrar conversas..." 
              style={{ 
                width: '100%', 
                boxSizing: 'border-box', // 👈 AQUI ESTÁ O CONSERTO! O Input não vaza mais.
                padding: '8px 10px 8px 35px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                outline: 'none', 
                fontSize: '0.85rem' 
              }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contatos.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              Nenhuma conversa iniciada.<br/>Clique no <b>+</b> para adicionar alguém.
            </div>
          ) : (
            contatos.map(contato => (
              <div 
                key={contato.chat_id} 
                onClick={() => abrirChat(contato.chat_id, contato)}
                style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: chatAtivoId === contato.chat_id ? '#eff6ff' : 'transparent', borderLeft: chatAtivoId === contato.chat_id ? '4px solid #6C63FF' : '4px solid transparent' }}
              >
                <div style={{ position: 'relative', marginRight: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#64748b" /></div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', color: '#1e293b' }}>{contato.nome || 'Usuário'}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6C63FF', fontWeight: '600' }}>{contato.surgitag}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 🔴 ÁREA DO CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: chatAtivoId ? 'white' : '#f8fafc' }}>
        
        {!chatAtivoId ? (
          // TELA VAZIA (Quando não clicou em nenhum contato)
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
             <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}><Info size={30} color="#64748b" /></div>
             <p style={{ margin: 0, fontWeight: '500' }}>Selecione um contato para iniciar a comunicação.</p>
          </div>
        ) : (
          // CHAT ABERTO
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>{contatoAtivo?.nome}</h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '12px', fontWeight: '600' }}>Equipe</span>
              </div>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {mensagens.map(msg => {
                const isMe = msg.sender_id === usuario?.id;
                const hora = new Date(msg.enviada_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
                    <div style={{
                      background: isMe ? '#6C63FF' : 'white',
                      color: isMe ? 'white' : '#334155',
                      padding: '12px 16px',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      border: isMe ? 'none' : '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      wordBreak: 'break-word' // Evita que textos longos sem espaço quebrem o layout
                    }}>
                      {msg.conteudo}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensagem(e)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1e293b' }} 
                />
                <button onClick={handleEnviarMensagem} style={{ background: '#6C63FF', color: 'white', border: 'none', minWidth: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;