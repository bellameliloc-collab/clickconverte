import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { nome, email, negocio, mensagem } = await req.json()

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 })
    }

    await resend.emails.send({
      from: "ClickConverte Site <onboarding@resend.dev>",
      to: "contato@clickconverte.com.br",
      replyTo: email,
      subject: `Novo contato de ${nome}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1b1c18;">
          <h2 style="color: #324b67; font-size: 24px; margin-bottom: 24px;">Novo contato via site</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f4f2eb; font-weight: 600; width: 140px;">Nome</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f4f2eb;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f4f2eb; font-weight: 600;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f4f2eb;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f4f2eb; font-weight: 600;">Tipo de negócio</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f4f2eb;">${negocio || "Não informado"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px 12px 0; font-weight: 600; vertical-align: top;">Mensagem</td>
              <td style="padding: 12px 0; white-space: pre-wrap;">${mensagem}</td>
            </tr>
          </table>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem." }, { status: 500 })
  }
}
