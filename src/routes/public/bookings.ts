import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const bodySchema = z.object({
  roomId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(6)
})

export default async function bookingsPublic(app: FastifyInstance) {
  app.post('/bookings', async (req: any, reply) => {
    const body = bodySchema.parse(req.body)

    const room = await app.prisma.room.findUnique({ where: { id: body.roomId } })
    if (!room) return reply.code(404).send({ message: 'Room not found' })

    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)

    // Validación básica
    if (!(checkIn < checkOut)) {
      return reply.code(400).send({ message: 'Invalid dates' })
    }

    // Disponibilidad
    const overlap = await app.prisma.booking.findFirst({
      where: {
        roomId: body.roomId,
        status: { in: ['ACCEPTED'] },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn }
      }
    })

    if (overlap) {
      return reply.code(409).send({ message: 'Room not available' })
    }

    const booking = await app.prisma.booking.create({
      data: {
        roomId: room.id,
        roomName: room.name,
        checkIn,
        checkOut,
        guests: body.guests,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        status: 'PENDING'
      }
    })

    return reply.code(201).send(booking)
  })
}
