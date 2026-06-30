import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data  = await req.formData()
    const email = (data.get('email') as string | null)?.trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'E-mail inválido.' }, { status: 400 })
    }

    // ── Integração futura ────────────────────────────────────────────────────
    // Aqui você pode integrar com:
    //   • Mailchimp:    POST /3.0/lists/{id}/members
    //   • Brevo:        POST https://api.brevo.com/v3/contacts
    //   • ConvertKit:   POST /v3/forms/{id}/subscribe
    //   • ActiveCampaign, HubSpot, etc.
    //
    // Exemplo com Brevo (descomente e adicione BREVO_API_KEY no .env.local):
    //
    // await fetch('https://api.brevo.com/v3/contacts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'api-key': process.env.BREVO_API_KEY ?? '',
    //   },
    //   body: JSON.stringify({
    //     email,
    //     listIds: [Number(process.env.BREVO_LIST_ID ?? 1)],
    //     updateEnabled: true,
    //   }),
    // })
    // ────────────────────────────────────────────────────────────────────────

    // Notificação por e-mail (opcional — requer Resend ou nodemailer)
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL
    if (notifyEmail) {
      console.log(`[Lead] Novo e-mail capturado: ${email} → notificar ${notifyEmail}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Guia enviado! Verifique sua caixa de entrada em breve.',
    })
  } catch (err) {
    console.error('[Lead] Erro:', err)
    return NextResponse.json({ success: false, message: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
