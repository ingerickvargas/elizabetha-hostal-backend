"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminAuth;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const schema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4)
});
async function adminAuth(app) {
    app.post('/login', async (req, reply) => {
        const body = schema.parse(req.body);
        const user = await app.prisma.adminUser.findUnique({
            where: { email: body.email }
        });
        if (!user)
            return reply.code(401).send({ message: 'Invalid credentials' });
        const ok = await bcryptjs_1.default.compare(body.password, user.passwordHash);
        if (!ok)
            return reply.code(401).send({ message: 'Invalid credentials' });
        const token = app.jwt.sign({ sub: user.id, email: user.email });
        return { token };
    });
}
