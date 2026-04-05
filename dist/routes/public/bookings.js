"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookingsPublic;
const zod_1 = require("zod");
const bodySchema = zod_1.z.object({
    roomId: zod_1.z.string(),
    checkIn: zod_1.z.string(),
    checkOut: zod_1.z.string(),
    guests: zod_1.z.number().int().min(1),
    guestName: zod_1.z.string().min(2),
    guestEmail: zod_1.z.string().email(),
    guestPhone: zod_1.z.string().min(6)
});
async function bookingsPublic(app) {
    app.post('/bookings', async (req, reply) => {
        const body = bodySchema.parse(req.body);
        const room = await app.prisma.room.findUnique({ where: { id: body.roomId } });
        if (!room)
            return reply.code(404).send({ message: 'Room not found' });
        const checkIn = new Date(body.checkIn);
        const checkOut = new Date(body.checkOut);
        // Validación básica
        if (!(checkIn < checkOut)) {
            return reply.code(400).send({ message: 'Invalid dates' });
        }
        // Disponibilidad
        const overlap = await app.prisma.booking.findFirst({
            where: {
                roomId: body.roomId,
                status: { in: ['ACCEPTED'] },
                checkIn: { lt: checkOut },
                checkOut: { gt: checkIn }
            }
        });
        if (overlap) {
            return reply.code(409).send({ message: 'Room not available' });
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
        });
        return reply.code(201).send(booking);
    });
}
