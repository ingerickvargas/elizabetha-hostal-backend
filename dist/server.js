"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("dotenv/config");
const app = (0, app_1.buildApp)();
const start = async () => {
    try {
        await app.listen({ port: Number(process.env.PORT) || 3001,
            host: '0.0.0.0' });
        console.log('🚀 Backend running');
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
