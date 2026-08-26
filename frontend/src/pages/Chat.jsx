import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Motorista do Paywall
import { Send, Paperclip, Search, Plus, User, Info, X, Check, Trash2, Loader2, Volume2, Smile, ChevronDown, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase'; 
import { useAuth } from '../context/AuthContext'; 

const somNotificacao = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");

// 🌟 CONFIGURAÇÃO DE CORES DOS STATUS
const STATUS_CONFIG = {
  online: { cor: '#10b981', label: 'Online' },
  ocupado: { cor: '#ef4444', label: 'Ocupado' },
  ausente: { cor: '#f59e0b', label: 'Ausente' },
  almoco: { cor: '#8b5cf6', label: 'No Almoço' },
  offline: { cor: '#94a3b8', label: 'Offline' }
};

// 🌟 MINI TECLADO DE EMOJIS
const EMOJIS = ['😀','😂','🤣','🥰','😍','😎','🤔','🙄','😴','😷','🤐','🙌','👍','👎','🙏','💪','🔥','🎉','❤️','💔','👀','✅','❌','💡','⭐'];

function Chat() {
  const { usuario } = useAuth(); 
  const navigate = useNavigate(); // 👈 Inicializa o Motorista
  
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  
  const [contatos, setContatos] = useState([]);
  const [chatAtivoId, setChatAtivoId] = useState(null);
  const [contatoAtivo, setContatoAtivo] = useState(null);
  const [meuPerfil, setMeuPerfil] = useState(null);

  const [meuStatus, setMeuStatus] = useState('online');
  const [mostrarMenuStatus, setMostrarMenuStatus] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [buscaTag, setBuscaTag] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [erroBusca, setErroBusca] = useState('');
  const [loadingBusca, setLoadingBusca] = useState(false);

  // 👇 ESTADO DO PLANO DO USUÁRIO
  const [planoAtual, setPlanoAtual] = useState("free");

  const arquivoInputRef = useRef(null);
  const [enviandoAnexo, setEnviandoAnexo] = useState(false);

  const mensagensFimRef = useRef(null);

  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const testarSom = () => {
    somNotificacao.play()
      .then(() => alert("🔊 O som está funcionando perfeitamente!"))
      .catch((e) => alert("❌ O navegador bloqueou o som. Verifique as permissões."));
  };

  useEffect(() => {
    if (!usuario) return;
    const inicializar = async () => {
      let { data: perfil } = await supabase.from('profiles').select('*').eq('id', usuario.id).single();
      if (!perfil) {
        const primeiroNome = usuario.email.split('@')[0];
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        const { data: novoPerfil } = await supabase.from('profiles').insert([{ 
          id: usuario.id, surgitag: `${primeiroNome}#${numeroAleatorio}`, nome_completo: primeiroNome, status: 'online', plano: 'free'
        }]).select().single();
        perfil = novoPerfil;
      }
      setMeuPerfil(perfil);
      setMeuStatus(perfil.status || 'online');
      
      // Armazena o plano atual
      setPlanoAtual(perfil.plano || 'free');
      
      carregarListaDeContatos();
    };
    inicializar();

    const canalStatus = supabase.channel('status_radar')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
         setContatos(prev => prev.map(c => c.id === payload.new.id ? { ...c, status: payload.new.status } : c));
         setContatoAtivo(prev => (prev && prev.id === payload.new.id) ? { ...prev, status: payload.new.status } : prev);
      }).subscribe();

    return () => supabase.removeChannel(canalStatus);
  }, [usuario]);

  const carregarListaDeContatos = async () => {
    const { data: meusChats } = await supabase.from('chat_participantes').select('chat_id').eq('user_id', usuario.id);
    if (!meusChats || meusChats.length === 0) return setContatos([]);
    const chatIds = meusChats.map(c => c.chat_id);
    
    const { data: outrosParticipantes } = await supabase
      .from('chat_participantes').select('chat_id, profiles(id, nome_completo, surgitag, status)')
      .in('chat_id', chatIds).neq('user_id', usuario.id); 

    if (outrosParticipantes) {
      setContatos(outrosParticipantes.map(p => ({
        chat_id: p.chat_id, id: p.profiles.id, nome: p.profiles.nome_completo, surgitag: p.profiles.surgitag, status: p.profiles.status || 'offline'
      })));
    }
  };

  // 🛑 A TRAVA FINANCEIRA DO CHAT (LEÃO DE CHÁCARA) 🛑
  const handleAbrirModalAdicionar = () => {
    // Regra do Plano Free: Chat bloqueado (0 contatos)
    if (planoAtual === 'free') {
        alert("🔒 Recurso Premium!\n\nO Chat Seguro da Equipe não está disponível no plano gratuito. Faça o upgrade para o plano Starter e converse com sua equipe.");
        navigate('/planos'); // Joga pro paywall
        return;
    }

    // Regra do Plano Starter: Máximo de 2 contatos na equipe
    if (planoAtual === 'starter' && contatos.length >= 2) {
        alert("🔒 Limite de Equipe Atingido!\n\nSeu plano Starter permite conversar com até 2 membros. Faça o upgrade para o plano Pro para adicionar membros ilimitados.");
        navigate('/planos'); // Joga pro paywall
        return;
    }

    // Se passou na catraca, abre o modal
    setModalAberto(true);
  };

  const handleMudarStatus = async (novoStatus) => {
    setMeuStatus(novoStatus); 
    setMostrarMenuStatus(false);
    await supabase.from('profiles').update({ status: novoStatus }).eq('id', usuario.id); 
  };

  const adicionarEmoji = (emoji) => {
    setMensagem(prev => prev + emoji);
    setMostrarEmojis(false);
  };

  const handleBuscarSurgitag = async () => {
    if (!buscaTag.includes('#')) return setErroBusca('A SurgiTag precisa ter um # (Ex: Carolina#1234)');
    setLoadingBusca(true); setErroBusca(''); setResultadoBusca(null);
    const { data, error } = await supabase.from('profiles').select('*').eq('surgitag', buscaTag.trim()).single();
    if (error || !data) setErroBusca('Nenhum usuário encontrado com essa SurgiTag.');
    else if (data.id === usuario.id) setErroBusca('Você não pode adicionar a si mesmo.');
    else setResultadoBusca(data);
    setLoadingBusca(false);
  };

  const handleAdicionarContato = async () => {
    if (!resultadoBusca) return;
    const chatExistente = contatos.find(c => c.id === resultadoBusca.id);
    if (chatExistente) {
      alert("Vocês já possuem uma conversa ativa!");
      setModalAberto(false);
      return abrirChat(chatExistente.chat_id, chatExistente);
    }
    const { data: novoChat } = await supabase.from('chats').insert([{}]).select().single();
    await supabase.from('chat_participantes').insert([
      { chat_id: novoChat.id, user_id: usuario.id }, { chat_id: novoChat.id, user_id: resultadoBusca.id }
    ]);
    setModalAberto(false); setBuscaTag(''); setResultadoBusca(null);
    carregarListaDeContatos();
    abrirChat(novoChat.id, { id: resultadoBusca.id, nome: resultadoBusca.nome_completo, surgitag: resultadoBusca.surgitag, status: resultadoBusca.status });
  };

  const abrirChat = async (idDoChat, dadosDoContato) => {
    setChatAtivoId(idDoChat);
    setContatoAtivo(dadosDoContato);
    
    const { data: historico } = await supabase
      .from('mensagens').select('*, profiles(nome_completo)').eq('chat_id', idDoChat).order('enviada_em', { ascending: true });
    setMensagens(historico || []);
    
    supabase.removeAllChannels(); 

    supabase.channel(`sala_${idDoChat}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `chat_id=eq.${idDoChat}` }, 
      async (payload) => {
        if (payload.new.sender_id === usuario.id) return; 
        const { data: sender } = await supabase.from('profiles').select('nome_completo').eq('id', payload.new.sender_id).single();
        setMensagens((prev) => [...prev, { ...payload.new, profiles: sender }]);
      }).subscribe();
  };

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (mensagem.trim() === '' || !chatAtivoId) return;
    const textoEnviado = mensagem;
    setMensagem(''); 
    
    const novaMsgTemp = { id: Date.now(), chat_id: chatAtivoId, sender_id: usuario.id, conteudo: textoEnviado, enviada_em: new Date().toISOString() };
    setMensagens(prev => [...prev, novaMsgTemp]);

    await supabase.from('mensagens').insert([{ chat_id: chatAtivoId, sender_id: usuario.id, conteudo: textoEnviado }]);
  };

  const handleUploadAnexo = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatAtivoId) return;
    setEnviandoAnexo(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${chatAtivoId}/${fileName}`; 

    try {
      const { error: uploadError } = await supabase.storage.from('chat_anexos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('chat_anexos').getPublicUrl(filePath);
      const conteudoMsg = `📎 ${file.name}`; 
      
      const novaMsgTemp = { id: Date.now(), chat_id: chatAtivoId, sender_id: usuario.id, conteudo: conteudoMsg, anexo_url: data.publicUrl, enviada_em: new Date().toISOString() };
      setMensagens(prev => [...prev, novaMsgTemp]); 

      await supabase.from('mensagens').insert([{ chat_id: chatAtivoId, sender_id: usuario.id, conteudo: conteudoMsg, anexo_url: data.publicUrl }]);
    } catch (error) {
      alert('Erro ao enviar anexo.');
    } finally {
      setEnviandoAnexo(false);
      arquivoInputRef.current.value = ""; 
    }
  };

  const handleExcluirChat = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir toda a conversa com ${contatoAtivo?.nome}?`)) return;
    await supabase.from('chats').delete().eq('id', chatAtivoId);
    setChatAtivoId(null); setContatoAtivo(null); setMensagens([]); carregarListaDeContatos(); 
  };

  return (
    <div className="chat-container" style={{ display: 'flex', height: '100%', minHeight: '600px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' }}>
      
      {/* MODAL DE BUSCA RESPONSIVO */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Adicionar à Equipe</h3>
              <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setModalAberto(false)} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="text" value={buscaTag} onChange={(e) => setBuscaTag(e.target.value)} placeholder="Ex: Murilo#1024" style={{ flex: 1, boxSizing: 'border-box', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              <button onClick={handleBuscarSurgitag} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{loadingBusca ? '...' : 'Buscar'}</button>
            </div>
            {erroBusca && <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>{erroBusca}</p>}
            {resultadoBusca && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#64748b" /></div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', color: '#1e293b', fontSize: '0.95rem' }}>{resultadoBusca.nome_completo}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#6C63FF', fontWeight: '600' }}>{resultadoBusca.surgitag}</span>
                  </div>
                </div>
                <button onClick={handleAdicionarContato} style={{ background: '#10b981', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={18} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔴 BARRA LATERAL (CONTATOS E STATUS) */}
      <div className={`chat-sidebar ${chatAtivoId ? 'oculto-mobile' : ''}`} style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc', flexShrink: 0 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1e293b', fontWeight: '700' }}>Equipe</h2>
              {meuPerfil && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Minha Tag: <strong style={{ color: '#6C63FF', userSelect: 'all' }}>{meuPerfil.surgitag}</strong></span>}
            </div>
            
            {/* 👇 O GATILHO DA BARREIRA ESTÁ EXATAMENTE AQUI 👇 */}
            <button onClick={handleAbrirModalAdicionar} style={{ background: '#6C63FF', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)' }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}><Plus size={18} /></button>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <button 
              onClick={() => setMostrarMenuStatus(!mostrarMenuStatus)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#475569', transition: '0.2s' }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_CONFIG[meuStatus].cor }} />
              {STATUS_CONFIG[meuStatus].label}
              <ChevronDown size={14} color="#94a3b8" />
            </button>

            {mostrarMenuStatus && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '5px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, width: '150px' }}>
                {Object.keys(STATUS_CONFIG).map(statusKey => (
                  <div 
                    key={statusKey} 
                    onClick={() => handleMudarStatus(statusKey)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', color: '#334155' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_CONFIG[statusKey].cor }} />
                    {STATUS_CONFIG[statusKey].label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Filtrar conversas..." style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contatos.map(contato => (
            <div key={contato.chat_id} onClick={() => abrirChat(contato.chat_id, contato)} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: chatAtivoId === contato.chat_id ? '#eff6ff' : 'transparent', borderLeft: chatAtivoId === contato.chat_id ? '4px solid #6C63FF' : '4px solid transparent' }}>
              <div style={{ position: 'relative', marginRight: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="#64748b" />
                </div>
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: STATUS_CONFIG[contato.status]?.cor || '#94a3b8', borderRadius: '50%', border: '2px solid white' }} />
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
      <div className={`chat-main ${!chatAtivoId ? 'oculto-mobile' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: chatAtivoId ? 'white' : '#f8fafc', minWidth: 0 }}>
        {!chatAtivoId ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
             <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}><Info size={30} color="#64748b" /></div>
             <p style={{ margin: 0, fontWeight: '500' }}>Selecione um contato para iniciar a comunicação.</p>
             <button onClick={testarSom} style={{ marginTop: '20px', background: 'transparent', color: '#6C63FF', border: '1px solid #6C63FF', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={18} /> Testar Áudio do Chat
             </button>
          </div>
        ) : (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="btn-voltar-mobile" onClick={() => setChatAtivoId(null)} style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }}>
                   <ArrowLeft size={24} />
                </button>
                <h3 style={{ margin: 0, color: '#1e293b' }}>{contatoAtivo?.nome}</h3>
                {contatoAtivo?.status && (
                  <span style={{ fontSize: '0.75rem', color: STATUS_CONFIG[contatoAtivo.status]?.cor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_CONFIG[contatoAtivo.status]?.cor }} />
                    {STATUS_CONFIG[contatoAtivo.status]?.label}
                  </span>
                )}
              </div>
              <button onClick={handleExcluirChat} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex' }}><Trash2 size={20} /></button>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {mensagens.map(msg => {
                const isMe = msg.sender_id === usuario?.id;
                const hora = new Date(msg.enviada_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{
                      background: isMe ? '#6C63FF' : 'white', color: isMe ? 'white' : '#334155',
                      padding: '12px 16px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: isMe ? 'none' : '1px solid #e2e8f0',
                      fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word'
                    }}>
                      {msg.anexo_url ? (
                        <a href={msg.anexo_url} target="_blank" rel="noopener noreferrer" style={{ color: isMe ? 'white' : '#6C63FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                          <div style={{ background: isMe ? 'rgba(255,255,255,0.2)' : '#eff6ff', padding: '8px', borderRadius: '8px', display: 'flex' }}><Paperclip size={18} /></div>
                          {msg.conteudo.replace('📎 ', '')}
                        </a>
                      ) : (
                        msg.conteudo
                      )}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', display: 'block', textAlign: isMe ? 'right' : 'left' }}>{hora}</span>
                  </div>
                );
              })}
              <div ref={mensagensFimRef} />
            </div>

            <div style={{ padding: '15px', borderTop: '1px solid #e2e8f0', background: 'white', position: 'relative' }}>
              
              {mostrarEmojis && (
                <div className="emoji-picker-mobile" style={{ position: 'absolute', bottom: '80px', left: '20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', zIndex: 10 }}>
                  {EMOJIS.map(emoji => (
                    <span 
                      key={emoji} 
                      onClick={() => adicionarEmoji(emoji)} 
                      style={{ fontSize: '1.5rem', cursor: 'pointer', textAlign: 'center', transition: '0.2s', padding: '4px', borderRadius: '8px' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '8px 12px', borderRadius: '24px' }}>
                <button onClick={() => setMostrarEmojis(!mostrarEmojis)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: mostrarEmojis ? '#6C63FF' : '#64748b', display: 'flex', transition: '0.2s' }}>
                  <Smile size={20} />
                </button>

                <input type="file" ref={arquivoInputRef} onChange={handleUploadAnexo} style={{ display: 'none' }} accept="image/*,application/pdf" />
                <button onClick={() => arquivoInputRef.current.click()} disabled={enviandoAnexo} title="Anexar Imagem ou PDF" style={{ background: 'none', border: 'none', cursor: enviandoAnexo ? 'not-allowed' : 'pointer', color: enviandoAnexo ? '#cbd5e1' : '#64748b', display: 'flex' }}>
                  {enviandoAnexo ? <Loader2 size={20} className="lucide-spin" /> : <Paperclip size={20} />}
                </button>
                
                <input type="text" placeholder="Digite..." value={mensagem} onChange={(e) => setMensagem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensagem(e)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1e293b', minWidth: '50px' }} />
                
                <button onClick={handleEnviarMensagem} style={{ background: '#6C63FF', color: 'white', border: 'none', minWidth: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        .lucide-spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .btn-voltar-mobile { display: none !important; }

        @media (max-width: 768px) {
          .chat-container {
            border-radius: 0 !important;
            min-height: calc(100vh - 140px) !important;
          }
          .chat-sidebar {
            width: 100% !important;
            border-right: none !important;
          }
          .chat-main {
            width: 100% !important;
          }
          .oculto-mobile {
            display: none !important;
          }
          .btn-voltar-mobile {
            display: flex !important;
            align-items: center;
            justify-content: center;
            margin-right: 5px;
          }
          .emoji-picker-mobile {
            left: 5px !important;
            right: 5px !important;
            bottom: 70px !important;
            grid-template-columns: repeat(7, 1fr) !important;
            width: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Chat;