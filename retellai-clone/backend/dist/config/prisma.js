"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPrisma = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const environment_1 = require("./environment");
if (!environment_1.environment.databaseUrl) {
    console.warn("⚠️  DATABASE_URL is not set. Prisma client may fail to connect.");
}
exports.prisma = global.prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
const connectPrisma = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ Connected to the database");
    }
    catch (error) {
        console.error("❌ Failed to connect to the database", error);
        throw error;
    }
};
exports.connectPrisma = connectPrisma;
//# sourceMappingURL=prisma.js.map