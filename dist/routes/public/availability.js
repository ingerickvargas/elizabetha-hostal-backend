"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = availabilityPublic;
const zod_1 = require("zod");
const schema = zod_1.z.object({
    roomId: zod_1.z.string(),
    checkIn: zod_1.z.string(), // YYYY-MM-DD
    checkOut: zod_1.z.string() // YYYY-MM-DD
});
async function availabilityPublic(app) {
    app.get('/availability', async (req) => {
        const q = schema.parse(req.query);
        const checkIn = new Date(q.checkIn);
        const checkOut = new Date(q.checkOut);
        const overlap = await app.prisma.booking.findFirst({
            where: {
                roomId: q.roomId,
                status: "ACCEPTED",
                checkIn: { lt: checkOut },
                checkOut: { gt: checkIn }
            }
        });
        return { available: !overlap };
    });
}
