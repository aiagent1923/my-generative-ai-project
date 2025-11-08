import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Server as SocketIOServer } from "socket.io";

import { environment } from "./config/environment";
import { connectPrisma } from "./config/prisma";
import authRoutes from "./routes/auth";
import agentRoutes from "./routes/agents";
import callRoutes from "./routes/calls";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  path: environment.socketIoPath,
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

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/calls", callRoutes);

const startServer = async () => {
  try {
    await connectPrisma();

    server.listen(environment.port, () => {
      console.log(`🚀 Server listening on port ${environment.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();
