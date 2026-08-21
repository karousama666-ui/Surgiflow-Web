import { createClient } from '@supabase/supabase-js';

// Inicializa o Supabase com a Chave Mestra (Service Role)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // 1. O Asaas faz uma verificação inicial de segurança, precisamos permitir
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    try {
        const evento = req.body;
        console.log('🔔 Webhook recebido do Asaas:', evento.event);

        // 2. Só queremos agir se o pagamento for confirmado ou recebido
        if (evento.event === 'PAYMENT_CONFIRMED' || evento.event === 'PAYMENT_RECEIVED') {
            const pagamento = evento.payment;
            
            // Descobrindo o plano pelo valor que foi pago
            let novoPlano = 'free';
            if (pagamento.value === 149.90) {
                novoPlano = 'starter';
            } else if (pagamento.value === 399.90) {
                novoPlano = 'pro';
            }

            // Pegando o e-mail do cliente (o Asaas envia o customerEmail se o cliente já existe)
            // Em alguns casos, pode vir dentro de uma requisição diferente, mas o padrão moderno do Asaas inclui na cobrança ou cliente.
            // Para garantir, vamos checar se o email veio no objeto de pagamento ou buscar pelo ID do cliente
            let emailCliente = pagamento.customerEmail || pagamento.email; 
            
            // (Para o nosso MVP, o cliente PRECISA ter se cadastrado com o mesmo e-mail no SurgiFlow e no Asaas)
            if (emailCliente && novoPlano !== 'free') {
                
                // Vai no Supabase e procura o usuário por esse e-mail
                const { data: users, error: userError } = await supabase.auth.admin.listUsers();
                if (userError) throw userError;

                const usuario = users.users.find(u => u.email === emailCliente);

                if (usuario) {
                    // Atualiza a tabela 'perfis' liberando o acesso Premium!
                    const { error: updateError } = await supabase
                        .from('perfis')
                        .update({ plano: novoPlano })
                        .eq('id', usuario.id);

                    if (updateError) throw updateError;
                    
                    console.log(`✅ SUCESSO: O usuário ${emailCliente} foi promovido para o plano ${novoPlano}!`);
                } else {
                    console.log(`⚠️ ALERTA: Pagamento recebido, mas o e-mail ${emailCliente} não foi encontrado no banco de dados do SurgiFlow.`);
                }
            }
        }

        // 3. Avisa pro Asaas que recebemos a mensagem (senão ele fica tentando reenviar)
        return res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('❌ Erro crítico no Webhook:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}