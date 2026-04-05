"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminRooms;
const zod_1 = require("zod");
async function adminRooms(app) {
    app.get('/rooms', { preHandler: app.adminAuth }, async () => {
        return app.prisma.room.findMany({ orderBy: { id: 'asc' } });
    });
    app.patch('/rooms/:id', { preHandler: app.adminAuth }, async (req, reply) => {
        const id = String(req.params.id);
        const schema = zod_1.z.object({
            price: zod_1.z.number().int().positive().optional(),
            isActive: zod_1.z.boolean().optional(),
            image: zod_1.z.string().url().optional(),
            galleryImages: zod_1.z.array(zod_1.z.string().url()).optional(),
            name: zod_1.z.string().optional(),
            name_es: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
            description_es: zod_1.z.string().optional(),
            longDescription: zod_1.z.string().optional(),
            longDescription_es: zod_1.z.string().optional(),
            tag: zod_1.z.string().optional(),
            tag_es: zod_1.z.string().optional(),
            size: zod_1.z.string().optional(),
            size_es: zod_1.z.string().optional(),
            bathroom: zod_1.z.string().optional(),
            bathroom_es: zod_1.z.string().optional(),
            amenity: zod_1.z.string().optional(),
            amenity_es: zod_1.z.string().optional(),
            capacity: zod_1.z.number().int().positive().optional(),
            features: zod_1.z.any().optional()
        });
        const data = schema.parse(req.body);
        const updated = await app.prisma.room.update({
            where: { id },
            data
        });
        return reply.send(updated);
    });
}
