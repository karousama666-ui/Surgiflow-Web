import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Bot, User, ChevronRight } from 'lucide-react';

function ChatbotFAQ() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mensagem inicial de boas-vindas
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Olá! Sou o assistente virtual do SurgiFlow. Como posso ajudar com a plataforma hoje?' }
  ]);

  const messagesEndRef = useRef(null);

  // Faz o scroll descer automaticamente quando há nova mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Base de Conhecimento (Perguntas e Respostas)
  const faqDatabase = [
    {
      question: "Como mover um pedido de OPME?",
      answer: "É simples! Acesse a tela de 'Pedidos' no menu lateral e clique e arraste o card do paciente de uma coluna para a outra (ex: de 'Orçamento' para 'Aprovado')."
    },
    {
      question: "Como adiciono alguém da minha equipe?",
      answer: "Vá em 'Configurações' > 'Equipe e Acessos'. Preencha os dados do membro e clique em Adicionar. Lembre-se: o plano Free não permite adição de equipe."
    },
    {
      question: "Onde vejo os relatórios da RDC?",
      answer: "Os relatórios ficam na aba 'Relatórios' do menu principal. Eles reúnem os dados da agenda e de aprovação para auditorias (Disponível nos planos premium)."
    },
    {
      question: "Como mudar de Plano?",
      answer: "Acesse a aba 'Configurações', role até 'Minha Assinatura' e escolha o plano Starter ou Clinic Pro. O upgrade é ativado automaticamente após o pagamento."
    }
  ];

  const handleSendFaq = (faq) => {
    // Adiciona a pergunta do usuário
    setMessages(prev => [...prev, { sender: 'user', text: faq.question }]);
    
    // Simula um tempinho de digitação para ficar natural
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: faq.answer }]);
    }, 600);
  };

  return (
    <>
      {/* 🔴 O BOTÃO FLUTUANTE 🔴 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
          background: "#6C63FF",
          color: "white",
          border: "none",
          boxShadow: "0 10px 25px rgba(108, 99, 255, 0.4)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          transition: "transform 0.2s ease"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* 🔴 A JANELA DO CHAT 🔴 */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          width: "350px",
          height: "500px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
          border: "1px solid #e2e8f0",
          fontFamily: "'Montserrat', sans-serif"
        }}>
          
          {/* Cabeçalho do Chat */}
          <div style={{ background: "#0f172a", padding: "20px", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#6C63FF", padding: "8px", borderRadius: "10px", display: "flex" }}>
              <Bot size={24} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>Suporte SurgiFlow</h3>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
                Online e pronto para ajudar
              </span>
            </div>
          </div>

          {/* Área das Mensagens */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#f8fafc", display: "flex", flexDirection: "column", gap: "15px" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: "flex",
                flexDirection: msg.sender === 'user' ? "row-reverse" : "row",
                gap: "10px",
                alignItems: "flex-end"
              }}>
                {msg.sender === 'bot' && (
                  <div style={{ width: "28px", height: "28px", background: "#e2e8f0", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Bot size={16} color="#475569" />
                  </div>
                )}
                
                <div style={{
                  background: msg.sender === 'user' ? "#6C63FF" : "white",
                  color: msg.sender === 'user' ? "white" : "#334155",
                  padding: "12px 16px",
                  borderRadius: msg.sender === 'user' ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  maxWidth: "80%",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  border: msg.sender === 'bot' ? "1px solid #e2e8f0" : "none"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de Opções Rápidas (Botões) */}
          <div style={{ padding: "15px", borderTop: "1px solid #e2e8f0", background: "white" }}>
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 10px 0", fontWeight: "600", textAlign: "center" }}>Dúvidas Frequentes:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {faqDatabase.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => handleSendFaq(faq)}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    color: "#475569",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    transition: "0.2s"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#6C63FF"; e.currentTarget.style.color = "#6C63FF"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
                >
                  {faq.question}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </>
  );
}

export default ChatbotFAQ;