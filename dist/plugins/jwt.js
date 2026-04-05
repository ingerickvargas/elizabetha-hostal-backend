"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtPlugin = jwtPlugin;
async function jwtPlugin(app) {
    app.decorate('adminAuth', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch {
            return reply.code(401).send({ message: 'Unauthorized' });
        }
    });
}
