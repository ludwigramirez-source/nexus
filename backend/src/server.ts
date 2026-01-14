import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config/env';
import logger from './config/logger';
import prisma from './config/database';
import { verifyAccessToken } from './utils/jwt.util';

const server = http.createServer(app);

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.allowedOrigins,
    credentials: true,
  },
});

// Socket.io authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
    }
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Join request room
  socket.on('join_request', ({ requestId }) => {
    socket.join(`request:${requestId}`);
    logger.debug(`Socket ${socket.id} joined room request:${requestId}`);
  });

  // Leave request room
  socket.on('leave_request', ({ requestId }) => {
    socket.leave(`request:${requestId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in other modules
export { io };

// Start server
const PORT = config.app.port;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 API: http://localhost:${PORT}/api`);
  logger.info(`💚 Health: http://localhost:${PORT}/health`);
  logger.info(`🔌 Socket.io ready`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing server...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed');
    process.exit(0);
  });
});
