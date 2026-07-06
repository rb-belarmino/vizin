import { Resend } from 'resend'

// Instantiate conditionally to prevent crashing at startup if the key is missing
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function sendEmail({
  to,
  subject,
  react
}: {
  to: string
  subject: string
  react: React.ReactElement
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email would have been sent:', {
      to,
      subject
    })
    return { data: null, error: new Error('RESEND_API_KEY missing') }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Vizin <onboarding@resend.dev>',
      to,
      subject,
      react
    })

    if (error) {
      console.error('Erro na API do Resend:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Exceção ao enviar e-mail:', error)
    return { data: null, error }
  }
}
