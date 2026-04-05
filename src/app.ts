import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import prismaPlugin from './plugins/prisma'
import { jwtPlugin } from './plugins/jwt'

import roomsPublic from './routes/public/rooms'
import availabilityPublic from './routes/public/availability'
import bookingsPublic from './routes/public/bookings'
import searchRooms from "./routes/public/searchRooms";

import adminAuth from './routes/admin/auth'
import adminRooms from './routes/admin/rooms'
import adminBookings from './routes/admin/bookings'
import bookedDatesPublic from "./routes/public/bookedDates";

export const buildApp = () => {
  const app = Fastify({ logger: true })

  app.register(cors, { 
	origin: [
		"http://127.0.0.1:3000",
		"http://localhost:3000",
	],
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.register(jwt, { secret: process.env.JWT_SECRET! })
  app.register(prismaPlugin)
  app.register(jwtPlugin)

  app.register(roomsPublic, { prefix: '/api' })
  app.register(availabilityPublic, { prefix: '/api' })
  app.register(bookingsPublic, { prefix: '/api' })

  app.register(adminAuth, { prefix: '/api/admin' })
  app.register(adminRooms, { prefix: '/api/admin' })
  app.register(adminBookings, { prefix: '/api/admin' })
  app.register(bookedDatesPublic);
  app.register(searchRooms);

  app.get('/health', async () => ({ ok: true }))

  return app
}
