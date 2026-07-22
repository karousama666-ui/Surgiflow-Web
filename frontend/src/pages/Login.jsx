import Logo from "../components/layout/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from '../components/ui/Card';
import { Mail, Lock } from "lucide-react";

function Login() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        background: '#F5F7FB',
      }}
    >
      {/* COLUNA ESQUERDA */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <Card>
          <Logo />

          <Input

            icon={Mail}

            placeholder="Email"

          />

          <div style={{ height: '18px' }} />

          <Input
            icon={Lock}
            placeholder="Senha"
            type="password"
          />

          <div style={{ height: '28px' }} />

          <Button>Entrar</Button>
        </Card>
      </div>

      {/* COLUNA DIREITA */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #5B3FD6 0%, #7C63F2 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '56px',
            marginBottom: '28px',
            backdropFilter: 'blur(10px)',
          }}
        >
          🏥
        </div>

        <h2
          style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '18px',
            maxWidth: '520px',
            lineHeight: 1.2,
          }}
        >
          O centro de controle das suas cirurgias
        </h2>

        <p
          style={{
            fontSize: '18px',
            opacity: 0.92,
            maxWidth: '560px',
            lineHeight: 1.7,
          }}
        >
          Agenda, autorizações, anexos, relatórios e acompanhamento cirúrgico em uma única plataforma.
        </p>
      </div>
    </div>
  );
}

export default Login;