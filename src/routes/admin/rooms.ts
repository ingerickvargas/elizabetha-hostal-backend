import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export default async function adminRooms(app: FastifyInstance) {
  app.get('/rooms', { preHandler: app.adminAuth }, async () => {
    return app.prisma.room.findMany({ orderBy: { id: 'asc' } })
  })

  app.patch('/rooms/:id', { preHandler: app.adminAuth }, async (req: any, reply) => {
    const id = String(req.params.id)

    const schema = z.object({
      price: z.number().int().positive().optional(),
      isActive: z.boolean().optional(),
      image: z.string().url().optional(),
      galleryImages: z.array(z.string().url()).optional(),
      name: z.string().optional(),
      name_es: z.string().optional(),
      description: z.string().optional(),
      description_es: z.string().optional(),
      longDescription: z.string().optional(),
      longDescription_es: z.string().optional(),
      tag: z.string().optional(),
      tag_es: z.string().optional(),
      size: z.string().optional(),
      size_es: z.string().optional(),
      bathroom: z.string().optional(),
      bathroom_es: z.string().optional(),
      amenity: z.string().optional(),
      amenity_es: z.string().optional(),
      capacity: z.number().int().positive().optional(),
      features: z.any().optional()
    })

    const data = schema.parse(req.body)

    const updated = await app.prisma.room.update({
      where: { id },
      data
    })

    return reply.send(updated)
  })
}
