import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
}

type BookingEmailParams = {
  to: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: "ACCEPTED" | "REJECTED";
};

export async function sendBookingStatusEmail({
  to,
  guestName,
  roomName,
  checkIn,
  checkOut,
  status,
}: BookingEmailParams) {
  const isAccepted = status === "ACCEPTED";

  // Validar variables de entorno
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured in environment variables");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM not configured in environment variables");
  }

  const subject = isAccepted
    ? "✅ Tu reserva ha sido confirmada"
    : "❌ Tu reserva no pudo ser confirmada";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>Hola ${guestName},</h2>

      ${
        isAccepted
          ? `<p>¡Buenas noticias! Tu reserva ha sido <strong>ACEPTADA</strong>.</p>`
          : `<p>Lamentamos informarte que tu reserva fue <strong>RECHAZADA</strong>.</p>`
      }

      <p><strong>Habitación:</strong> ${roomName}</p>
      <p><strong>Check-in:</strong> ${checkIn}</p>
      <p><strong>Check-out:</strong> ${checkOut}</p>

      ${
        isAccepted
          ? `<p>Te esperamos con gusto en Hostal Elizabetha 🌿</p>`
          : `<p>Puedes intentar con otras fechas o contactarnos si necesitas ayuda.</p>`
      }

      <hr />
      <p style="font-size:12px;color:#666">
        Hostal Elizabetha – Salento, Quindío
      </p>
    </div>
  `;

  try {
    const resend = getResendClient();

    const result =await resend.emails.send({
	  from: process.env.EMAIL_FROM!,
	  to,
	  subject,
	  html,
	});

    console.log(`[Email] Booking status email sent successfully to ${to}:`, result);
    return result;
  } catch (error) {
    console.error(`[Email Error] Failed to send booking status email to ${to}:`, error);
    throw error;
  }
}
