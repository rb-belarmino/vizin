import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email would have been sent:', { to, subject });
    return { data: null, error: new Error('RESEND_API_KEY missing') };
  }

  try {
    const data = await resend.emails.send({
      from: 'Vizin <no-reply@vizin.demo>',
      to,
      subject,
      react,
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
