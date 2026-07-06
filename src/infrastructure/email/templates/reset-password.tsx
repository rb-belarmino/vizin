import * as React from 'react';

interface ResetPasswordEmailProps {
  resetLink: string;
  userName: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  resetLink,
  userName,
}) => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
      <h2>Olá, {userName}</h2>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta no Vizin.</p>
      <p>Se você não fez essa solicitação, pode ignorar este e-mail.</p>
      <div style={{ margin: '30px 0' }}>
        <a
          href={resetLink}
          style={{
            background: '#4f46e5',
            color: '#fff',
            padding: '12px 20px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block'
          }}
        >
          Redefinir Minha Senha
        </a>
      </div>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Este link expira em 1 hora.
      </p>
    </div>
  );
};

export default ResetPasswordEmail;
