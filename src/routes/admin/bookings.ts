import { FastifyInstance } from 'fastify'
import { sendBookingStatusEmail } from '../../services/emailService';

export default async function adminBookings(app: FastifyInstance) {
  app.get('/bookings', { preHandler: app.adminAuth }, async () => {
    return app.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  })

  
  app.patch("/bookings/:id/status", { preHandler: app.adminAuth }, async (req, reply) => {
	const { id } = req.params as { id: string };
	const { status } = req.body as { status: "PENDING" | "ACCEPTED" | "REJECTED" };

	if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
		return reply.code(400).send({ message: "Invalid status" });
	}

	const booking = await app.prisma.booking.findUnique({
		where: { id },
	});

	if (!booking) {
		return reply.code(404).send({ message: "Booking not found" });
	}

	if (booking.status === status) {
		return reply.send(booking);
	}

	const updated = await app.prisma.booking.update({
		where: { id },
		data: { status },
	});

	if (status === "ACCEPTED" || status === "REJECTED") {
		try {
			console.log(`[Booking] Sending ${status} email for booking ${id} to ${booking.guestEmail}`);
			await sendBookingStatusEmail({
				to: booking.guestEmail,
				guestName: booking.guestName,
				roomName: booking.roomName,
				checkIn: booking.checkIn.toISOString().slice(0, 10),
				checkOut: booking.checkOut.toISOString().slice(0, 10),
				status,
			});
			console.log(`[Booking] Email sent successfully for booking ${id}`);
		} catch (err) {
			console.error(`[Booking Error] Failed to send email for booking ${id}:`, err);
			req.log.error(err, `Error sending booking email for ${status} status`);
			// Return error response instead of silently failing
			return reply.code(500).send({ 
				message: "Booking status updated but failed to send notification email",
				error: err instanceof Error ? err.message : "Unknown error"
			});
		}
	}

	return reply.send(updated);
	});
}
