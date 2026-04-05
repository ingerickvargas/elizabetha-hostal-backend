"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const jwt_2 = require("./plugins/jwt");
const rooms_1 = __importDefault(require("./routes/public/rooms"));
const availability_1 = __importDefault(require("./routes/public/availability"));
const bookings_1 = __importDefault(require("./routes/public/bookings"));
const searchRooms_1 = __importDefault(require("./routes/public/searchRooms"));
const auth_1 = __importDefault(require("./routes/admin/auth"));
const rooms_2 = __importDefault(require("./routes/admin/rooms"));
const bookings_2 = __importDefault(require("./routes/admin/bookings"));
const bookedDates_1 = __importDefault(require("./routes/public/bookedDates"));
const buildApp = () => {
    const app = (0, fastify_1.default)({ logger: true });
    app.register(cors_1.default, {
        origin: [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.register(jwt_1.default, { secret: process.env.JWT_SECRET });
    app.register(prisma_1.default);
    app.register(jwt_2.jwtPlugin);
    app.register(rooms_1.default, { prefix: '/api' });
    app.register(availability_1.default, { prefix: '/api' });
    app.register(bookings_1.default, { prefix: '/api' });
    app.register(auth_1.default, { prefix: '/api/admin' });
    app.register(rooms_2.default, { prefix: '/api/admin' });
    app.register(bookings_2.default, { prefix: '/api/admin' });
    app.register(bookedDates_1.default);
    app.register(searchRooms_1.default);
    app.get('/health', async () => ({ ok: true }));
    return app;
};
exports.buildApp = buildApp;
