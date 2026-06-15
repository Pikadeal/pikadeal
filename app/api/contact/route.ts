import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { nom, email, message } = await req.json()

    await resend.emails.send({
      from: 'PikaDeal Contact <onboarding@resend.dev>',
      to: 'dark-nyu25@hotmail.fr',
      subject: `Nouveau message de ${nom} — PikaDeal`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111;">Nouveau message PikaDeal</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <p style="background: #f9fafb; padding: 12px; border-radius: 8px; color: #555;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}