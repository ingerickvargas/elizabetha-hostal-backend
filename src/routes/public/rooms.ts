import { FastifyInstance } from 'fastify'

export default async function roomsPublic(app: FastifyInstance) {
  app.get('/rooms', async () => {
    const rooms = await app.prisma.room.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' }
    })
    return rooms
  })

  app.get('/rooms/:id', async (req: any, reply) => {
    const room = await app.prisma.room.findUnique({
      where: { id: req.params.id }
    })
    if (!room) return reply.code(404).send({ message: 'Room not found' })
    return room
  })
}
