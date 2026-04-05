import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const schema = z.object({
  roomId: z.string(),
  checkIn: z.string(),  // YYYY-MM-DD
  checkOut: z.string()  // YYYY-MM-DD
})

export default async function availabilityPublic(app: FastifyInstance) {
  app.get('/availability', async (req: any) => {
    const q = schema.parse(req.query)

    const checkIn = new Date(q.checkIn)
    const checkOut = new Date(q.checkOut)

    const overlap = await app.prisma.booking.findFirst({
      where: {
        roomId: q.roomId,
        status: "ACCEPTED",
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn }
      }
    })

    return { available: !overlap }
  })
}
