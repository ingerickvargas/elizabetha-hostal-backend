"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = searchRooms;
async function searchRooms(app) {
    app.get("/api/search-rooms", async (req, reply) => {
        const { checkIn, checkOut, guests } = req.query;
        if (!checkIn || !checkOut) {
            return reply.code(400).send({ message: "checkIn and checkOut are required" });
        }
        const guestsN = Number(guests || 1);
        // 1) Traer habitaciones con capacidad >= guests
        const rooms = await app.prisma.room.findMany({
            where: { capacity: { gte: guestsN } },
            orderBy: { id: "asc" },
        });
        // 2) Traer bookings que bloquean rango (PENDING/ACCEPTED) y que se crucen con el rango
        // overlap: booking.checkIn < checkOut && booking.checkOut > checkIn
        const bookings = await app.prisma.booking.findMany({
            where: {
                status: "ACCEPTED",
                checkIn: { lt: new Date(`${checkOut}T00:00:00`) },
                checkOut: { gt: new Date(`${checkIn}T00:00:00`) },
            },
            select: { roomId: true },
        });
        const blockedRoomIds = new Set(bookings.map(b => String(b.roomId)));
        const available = rooms.filter(r => !blockedRoomIds.has(String(r.id)));
        return available;
    });
}
