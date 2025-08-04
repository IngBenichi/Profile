import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, subject, message } = await req.json();

    // Configura el transporter SMTP usando variables de entorno
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Construir URL absoluta para el logo
    const baseUrl = process.env.NEXT_PRIVATE_BASE_URL || 'http://localhost:3000';
    const logoUrl = `${baseUrl}/logo.jpg`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
      subject: subject,
      replyTo: email,
      text: `Nombre: ${firstName} ${lastName}\nEmail: ${email}\nAsunto: ${subject}\nMensaje:\n${message}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 0;">
          <table style="max-width: 520px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 4px 24px #0002; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr>
              <td style="background: linear-gradient(90deg, #2563eb 0%, #1e293b 100%); color: #fff; padding: 32px 32px 16px 32px; text-align: center;">
                <img src="${logoUrl}" width="56" height="56" alt="Logo Camilo Benitez" style="margin-bottom: 12px; border-radius: 12px; box-shadow: 0 2px 8px #0002;" />
                <h2 style="margin: 0; font-size: 2rem; letter-spacing: 1px; font-weight: 700;">Nuevo mensaje de contacto</h2>
                <p style="margin: 8px 0 0 0; font-size: 1.1rem; color: #cbd5e1;">Has recibido un nuevo mensaje desde tu portafolio</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px; color: #222;">
                <div style="margin-bottom: 18px;">
                  <span style="display: inline-block; min-width: 90px; color: #2563eb; font-weight: 600;">Nombre:</span> ${firstName} ${lastName}<br/>
                  <span style="display: inline-block; min-width: 90px; color: #2563eb; font-weight: 600;">Email:</span> <a href="mailto:${email}" style="color: #2563eb; text-decoration: underline;">${email}</a><br/>
                  <span style="display: inline-block; min-width: 90px; color: #2563eb; font-weight: 600;">Asunto:</span> ${subject}
                </div>
                <div style="margin: 28px 0; padding: 24px; background: #f1f5f9; border-radius: 10px; border-left: 5px solid #2563eb;">
                  <strong style="display: block; margin-bottom: 10px; color: #2563eb; font-size: 1.1rem;">Mensaje:</strong>
                  <span style="white-space: pre-line; color: #334155; font-size: 1.08rem;">${message}</span>
                </div>
                <p style="font-size: 0.98rem; color: #64748b; margin-top: 36px; text-align: right;">
                  <span style="font-size:1.1rem; color:#2563eb; font-weight:600;">Portfolio de Camilo Benitez</span><br>
                  Recibido desde el formulario de contacto.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Enviar correo de confirmación al remitente
    const confirmMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: '¡Hemos recibido tu mensaje!',
      text: `Hola ${firstName},\n\nTu mensaje ha sido recibido correctamente. Me pondré en contacto contigo lo antes posible.\n\nGracias por escribir.\n\nResumen de tu mensaje:\nAsunto: ${subject}\nMensaje: ${message}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 0;">
          <table style="max-width: 520px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 4px 24px #0002; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr>
              <td style="background: linear-gradient(90deg, #2563eb 0%, #1e293b 100%); color: #fff; padding: 32px 32px 16px 32px; text-align: center;">
                <img src="${logoUrl}" width="56" height="56" alt="Logo Camilo Benitez" style="margin-bottom: 12px; border-radius: 12px; box-shadow: 0 2px 8px #0002;" />
                <h2 style="margin: 0; font-size: 2rem; letter-spacing: 1px; font-weight: 700;">¡Mensaje recibido!</h2>
                <p style="margin: 8px 0 0 0; font-size: 1.1rem; color: #cbd5e1;">Gracias por contactarme, responderé pronto.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px; color: #222;">
                <p style="font-size: 1.1rem; margin-bottom: 18px;">Hola <strong>${firstName}</strong>,<br><br>
                  Tu mensaje ha sido recibido correctamente. Me pondré en contacto contigo lo antes posible.<br><br>
                  <span style="color: #2563eb;">¡Gracias por escribir!</span>
                </p>
                <div style="margin: 28px 0; padding: 24px; background: #f1f5f9; border-radius: 10px; border-left: 5px solid #2563eb;">
                  <strong style="display: block; margin-bottom: 10px; color: #2563eb; font-size: 1.1rem;">Resumen de tu mensaje:</strong>
                  <div style="margin-bottom: 8px;"><strong>Asunto:</strong> ${subject}</div>
                  <div style="white-space: pre-line; color: #334155; font-size: 1.08rem;">${message}</div>
                </div>
                <p style="font-size: 0.98rem; color: #64748b; margin-top: 36px; text-align: right;">
                  <span style="font-size:1.1rem; color:#2563eb; font-weight:600;">Portfolio de Camilo Benitez</span><br>
                  Este es un mensaje automático de confirmación.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
    await transporter.sendMail(confirmMailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    const err = error as Error;
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
