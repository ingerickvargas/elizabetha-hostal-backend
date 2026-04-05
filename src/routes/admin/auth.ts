import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
})

export default async function adminAuth(app: FastifyInstance) {
  app.post('/login', async (req: any, reply) => {
    const body = schema.parse(req.body)

    const user = await app.prisma.adminUser.findUnique({
      where: { email: body.email }
    })
    if (!user) return reply.code(401).send({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(body.password, user.passwordHash)
    if (!ok) return reply.code(401).send({ message: 'Invalid credentials' })

    const token = app.jwt.sign({ sub: user.id, email: user.email })
    return { token }
  })
}
