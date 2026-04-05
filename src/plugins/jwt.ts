import { FastifyInstance } from 'fastify'

export async function jwtPlugin(app: FastifyInstance) {
  app.decorate('adminAuth', async (request: any, reply: any) => {
    try {
      await request.jwtVerify()
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
  })
}

declare module 'fastify' {
  interface FastifyInstance {
    adminAuth: any
  }
}
