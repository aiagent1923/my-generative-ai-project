"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const socket_io_1 = require("socket.io");
const environment_1 = require("./config/environment");
const prisma_1 = require("./config/prisma");
const auth_1 = __importDefault(require("./routes/auth"));
const agents_1 = __importDefault(require("./routes/agents"));
const calls_1 = __importDefault(require("./routes/calls"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: environment_1.environment.socketIoPath,
    cors: {
        origin: true,
        credentials: true,
    },
});
io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", auth_1.default);
app.use("/api/agents", agents_1.default);
app.use("/api/calls", calls_1.default);
const startServer = async () => {
    try {
        await (0, prisma_1.connectPrisma)();
        server.listen(environment_1.environment.port, () => {
            console.log(`🚀 Server listening on port ${environment_1.environment.port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};
void startServer();
//# sourceMappingURL=index.js.map