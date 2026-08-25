import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search, Plus, User, Info, X, Check, Trash2, Bell, Loader2, Volume2 } from 'lucide-react';
import { supabase } from '../services/supabase'; 
import { useAuth } from '../context/AuthContext'; 

// Som de notificação
const somNotificacao = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");

function Chat() {
  const { usuario } = useAuth(); 
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  
  const [contatos, setContatos] = useState([]);
  const [chatAtivoId, setChatAtivoId] = useState(null);
  const [contatoAtivo, setContatoAtivo] = useState(null);
  const [meuPerfil, setMeuPerfil] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [buscaTag, setBuscaTag] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [erroBusca, setErroBusca] = useState('');
  const [loadingBusca, setLoadingBusca] = useState(false);

  const arquivoInputRef = useRef(null);
  const [enviandoAnexo, setEnviandoAnexo] = useState(false);
  
  // TOAST PROTEGIDO
  const [toast, setToast] = useState(null);

  const mensagensFimRef = useRef(null);

  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // FUNÇÃO DE TESTE DE ÁUDIO (Para você clicar e ver se o Chrome libera)
  const testarSom = () => {
    somNotificacao.play()
      .then(() => alert("🔊 O som está funcionando perfeitamente!"))
      .catch((e) => alert("❌ O navegador bloqueou o som. Verifique as permissões do site na barra de endereços."));
  };

  useEffect(() => {
    if (!usuario) return;
    const inicializar = async () => {
      let { data: perfil } = await supabase.from('profiles').select('*').eq('id', usuario.id).single();
      if (!perfil) {
        const primeiroNome = usuario.email.split('@')[0];
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        const { data: novoPerfil } = await supabase.from('profiles').insert([{ 
          id: usuario.id, surgitag: `${primeiroNome}#${numeroAleatorio}`, nome_completo: primeiroNome
        }]).select().single();
        perfil = novoPerfil;
      }
      setMeuPerfil(perfil);
      carregarListaDeContatos();
    };
    inicializar();
  }, [usuario]);

  const carregarListaDeContatos = async () => {
    const { data: meusChats } = await supabase.from('chat_participantes').select('chat_id').eq('user_id', usuario.id);
    if (!meusChats || meusChats.length === 0) return setContatos([]);
    const chatIds = meusChats.map(c => c.chat_id);
    const { data: outrosParticipantes } = await supabase
      .from('chat_participantes').select('chat_id, profiles(id, nome_completo, surgitag)')
      .in('chat_id', chatIds).neq('user_id', usuario.id); 

    if (outrosParticipantes) {
      setContatos(outrosParticipantes.map(p => ({
        chat_id: p.chat_id, id: p.profiles.id, nome: p.profiles.nome_completo, surgitag: p.profiles.surgitag
      })));
    }
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
      return abrirChat(chatExistente.chat_id, { nome: chatExistente.nome, surgitag: chatExistente.surgitag });
    }
    const { data: novoChat } = await supabase.from('chats').insert([{}]).select().single();
    await supabase.from('chat_participantes').insert([
      { chat_id: novoChat.id, user_id: usuario.id }, { chat_id: novoChat.id, user_id: resultadoBusca.id }
    ]);
    setModalAberto(false); setBuscaTag(''); setResultadoBusca(null);
    carregarListaDeContatos();
    abrirChat(novoChat.id, { nome: resultadoBusca.nome_completo, surgitag: resultadoBusca.surgitag });
  };

  // 5️⃣ ABRIR UM CHAT E OUVIR MENSAGENS (AGORA À PROVA DE FALHAS)
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
        
        // Se fui eu mesmo que enviei, ele mostra na tela mas NÃO toca o som e não mostra o Toast
        const fuiEu = payload.new.sender_id === usuario.id;

        try {
          const { data: sender } = await supabase.from('profiles').select('nome_completo').eq('id', payload.new.sender_id).single();
          const nomePessoa = sender?.nome_completo || 'Membro da Equipe';
          
          setMensagens((prev) => {
            // Evita duplicar a mensagem na tela se a "Atualização Otimista" já tiver desenhado ela
            const jaExiste = prev.find(m => m.conteudo === payload.new.conteudo && m.sender_id === payload.new.sender_id);
            if (jaExiste && fuiEu) return prev;
            return [...prev, { ...payload.new, profiles: sender }];
          });

          // 🌟 DISPARA A NOTIFICAÇÃO SOMENTE SE NÃO FUI EU QUE ENVIEI 🌟
          if (!fuiEu) {
            somNotificacao.play().catch(e => console.error('Som bloqueado:', e));
            
            // Força o Toast a aparecer na marra
            setToast({ id: Date.now(), nome: nomePessoa, texto: payload.new.conteudo });
            
            // Remove o Toast após 4 segundos
            setTimeout(() => {
              setToast(null);
            }, 4000);
          }

        } catch (erro) {
          console.error("Erro ao processar mensagem recebida:", erro);
        }

      }).subscribe();
  };

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (mensagem.trim() === '' || !chatAtivoId) return;
    const textoEnviado = mensagem;
    setMensagem(''); 
    
    // Atualização Otimista
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
    <div style={{ display: 'flex', height: '100%', minHeight: '600px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' }}>
      
      {/* 🌟 TOAST SUPER PODEROSO (Posição Absoluta à Tela Inteira do Navegador) 🌟 */}
      {toast && (
        <div style={{
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 2147483647, /* O z-index máximo permitido no CSS para ficar acima de TUDO */
          background: '#1e293b', 
          color: 'white', 
          padding: '16px 24px', 
          borderRadius: '12px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          animation: 'slideInToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          fontFamily: "'Montserrat', sans-serif",
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ background: '#10b981', padding: '10px', borderRadius: '50%', display: 'flex' }}>
            <Bell size={20} color="white" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '800' }}>{toast.nome}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
              {toast.texto.length > 35 ? toast.texto.substring(0,35) + '...' : toast.texto}
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE BUSCA */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Adicionar à Equipe</h3>
              <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setModalAberto(false)} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="text" value={buscaTag} onChange={(e) => setBuscaTag(e.target.value)} placeholder="Ex: Murilo#1024" style={{ flex: 1, boxSizing: 'border-box', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              <button onClick={handleBuscarSurgitag} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{loadingBusca ? 'Buscando...' : 'Buscar'}</button>
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

      {/* BARRA LATERAL */}
      <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1e293b', fontWeight: '700' }}>Equipe</h2>
              {meuPerfil && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Minha Tag: <strong style={{ color: '#6C63FF', userSelect: 'all' }}>{meuPerfil.surgitag}</strong></span>}
            </div>
            <button onClick={() => setModalAberto(true)} style={{ background: '#6C63FF', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={18} /></button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Filtrar conversas..." style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contatos.map(contato => (
            <div key={contato.chat_id} onClick={() => abrirChat(contato.chat_id, contato)} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: chatAtivoId === contato.chat_id ? '#eff6ff' : 'transparent', borderLeft: chatAtivoId === contato.chat_id ? '4px solid #6C63FF' : '4px solid transparent' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}><User size={20} color="#64748b" /></div>
              <div>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', color: '#1e293b' }}>{contato.nome}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6C63FF', fontWeight: '600' }}>{contato.surgitag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ÁREA DO CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: chatAtivoId ? 'white' : '#f8fafc' }}>
        {!chatAtivoId ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
             <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}><Info size={30} color="#64748b" /></div>
             <p style={{ margin: 0, fontWeight: '500' }}>Selecione um contato para iniciar a comunicação.</p>
             
             {/* 🌟 BOTÃO SECRETO PARA VOCÊ TESTAR SE SEU NAVEGADOR ESTÁ PERMITINDO ÁUDIO 🌟 */}
             <button onClick={testarSom} style={{ marginTop: '20px', background: 'transparent', color: '#6C63FF', border: '1px solid #6C63FF', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={18} /> Testar Áudio do Chat
             </button>

          </div>
        ) : (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>{contatoAtivo?.nome}</h3>
              </div>
              <button onClick={handleExcluirChat} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex' }}><Trash2 size={20} /></button>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {mensagens.map(msg => {
                const isMe = msg.sender_id === usuario?.id;
                const hora = new Date(msg.enviada_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
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

            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '8px 15px', borderRadius: '24px' }}>
                <input type="file" ref={arquivoInputRef} onChange={handleUploadAnexo} style={{ display: 'none' }} accept="image/*,application/pdf" />
                <button onClick={() => arquivoInputRef.current.click()} disabled={enviandoAnexo} title="Anexar Imagem ou PDF" style={{ background: 'none', border: 'none', cursor: enviandoAnexo ? 'not-allowed' : 'pointer', color: enviandoAnexo ? '#cbd5e1' : '#64748b', display: 'flex' }}>
                  {enviandoAnexo ? <Loader2 size={20} className="lucide-spin" /> : <Paperclip size={20} />}
                </button>
                <input type="text" placeholder="Digite sua mensagem..." value={mensagem} onChange={(e) => setMensagem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensagem(e)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1e293b' }} />
                <button onClick={handleEnviarMensagem} style={{ background: '#6C63FF', color: 'white', border: 'none', minWidth: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Send size={16} /></button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes slideInToast {
          0% { transform: translateX(100%) scale(0.5); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .lucide-spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Chat;