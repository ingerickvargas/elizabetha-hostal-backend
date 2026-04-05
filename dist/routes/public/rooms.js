"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roomsPublic;
async function roomsPublic(app) {
    app.get('/rooms', async () => {
        const rooms = await app.prisma.room.findMany({
            where: { isActive: true },
            orderBy: { id: 'asc' }
        });
        return rooms;
    });
    app.get('/rooms/:id', async (req, reply) => {
        const room = await app.prisma.room.findUnique({
            where: { id: req.params.id }
        });
        if (!room)
            return reply.code(404).send({ message: 'Room not found' });
        return room;
    });
}
