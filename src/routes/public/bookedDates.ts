import { FastifyInstance } from "fastify";

export default async function bookedDatesPublic(app: FastifyInstance) {
  app.get("/api/booked-dates", async (req, reply) => {
    const { roomId } = req.query as { roomId?: string };
    if (!roomId) return reply.code(400).send({ message: "roomId is required" });

    const bookings = await app.prisma.booking.findMany({
      where: {
        roomId,
        status: { in: ["PENDING", "ACCEPTED"] }, // decide si quieres bloquear solo ACCEPTED
      },
      select: { checkIn: true, checkOut: true, status: true },
      orderBy: { checkIn: "asc" },
    });

    // Convertimos a YYYY-MM-DD
    const toYMD = (d: Date) => d.toISOString().slice(0, 10);

    return bookings.map(b => ({
      start: toYMD(b.checkIn),
      end: toYMD(b.checkOut),
      status: b.status,
    }));
  });
}
