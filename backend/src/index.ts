import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { environment } from './config/environment';
import authRoutes from './routes/auth';
import agentsRoutes from './routes/agents';
import callsRoutes from './routes/calls';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'retellai-clone-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/calls', callsRoutes);

const port = environment.PORT;

server.listen(port, () => {
  console.log(`Backend listening on port ${port} in ${environment.NODE_ENV} mode`);
});
