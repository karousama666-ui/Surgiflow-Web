import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

// Som de notificação
const somNotificacao = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");

function GlobalChatNotificador() {
  const { usuario } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!usuario) return;

    // 🌟 RADAR ONIPRESENTE 🌟
    // Fica escutando a tabela de mensagens independente da tela que você está
    const canal = supabase.channel('radar_onipresente')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens' }, 
      async (payload) => {
        
        // 1. Se fui eu mesmo que mandei (de outra aba), ignora
        if (payload.new.sender_id === usuario.id) return;

        // 2. Vai rápido no banco ver se eu faço parte do chat onde essa mensagem caiu
        const { data: participacao } = await supabase.from('chat_participantes')
          .select('chat_id').eq('chat_id', payload.new.chat_id).eq('user_id', usuario.id).single();
          
        if (!participacao) return; // Se eu não estiver no grupo/chat, não apita pra mim

        // 3. Descobre quem mandou a mensagem
        const { data: sender } = await supabase.from('profiles').select('nome_completo').eq('id', payload.new.sender_id).single();
        const nomePessoa = sender?.nome_completo || 'Membro da Equipe';

        // 4. DISPARA O ALARME! 🔔
        somNotificacao.play().catch((e) => console.log("Áudio bloqueado pelo navegador", e));
        setToast({ id: Date.now(), nome: nomePessoa, texto: payload.new.conteudo });
        
        // Some depois de 4 segundos
        setTimeout(() => setToast(null), 4500);

      }).subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [usuario]);

  // Se não tem notificação, o componente fica invisível na tela
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