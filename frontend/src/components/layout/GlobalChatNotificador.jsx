import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react'; // 👈 NOVO: Importamos o 'X'
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

const somNotificacao = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");

function GlobalChatNotificador() {
  const { usuario } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!usuario) return;

    const canal = supabase.channel('radar_onipresente')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens' }, 
      async (payload) => {
        
        if (payload.new.sender_id === usuario.id) return;

        const { data: participacao } = await supabase.from('chat_participantes')
          .select('chat_id').eq('chat_id', payload.new.chat_id).eq('user_id', usuario.id).single();
          
        if (!participacao) return; 

        // 🌟 O GATILHO DA SIDEBAR: Grita para o resto do app que chegou mensagem!
        window.dispatchEvent(new CustomEvent('novaMensagemChat'));

        const { data: sender } = await supabase.from('profiles').select('nome_completo').eq('id', payload.new.sender_id).single();
        const nomePessoa = sender?.nome_completo || 'Membro da Equipe';

        somNotificacao.play().catch((e) => console.log("Áudio bloqueado", e));
        setToast({ id: Date.now(), nome: nomePessoa, texto: payload.new.conteudo });
        
        setTimeout(() => setToast(null), 4500);

      }).subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [usuario]);

  if (!toast) return null;

  return (
    <>
      <div style={{
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 2147483647, 
        background: '#1e293b', 
        color: 'white', 
        padding: '16px 45px 16px 24px', // 👈 NOVO: Mais espaço na direita para o X não encostar no texto
        borderRadius: '12px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        animation: 'slideInToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        fontFamily: "'Montserrat', sans-serif",
        borderLeft: '4px solid #10b981'
      }}>
        
        {/* 🌟 NOVO: O BOTÃO DE FECHAR (X) 🌟 */}
        <button 
          onClick={() => setToast(null)}
          style={{
            position: 'absolute', 
            top: '8px', 
            right: '8px', 
            background: 'transparent', 
            border: 'none', 
            color: '#94a3b8', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: '0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <X size={16} />
        </button>

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
      <style>{`
        @keyframes slideInToast {
          0% { transform: translateX(100%) scale(0.5); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default GlobalChatNotificador;