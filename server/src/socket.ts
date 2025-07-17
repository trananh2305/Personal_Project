import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

interface ConnectedUsers {
  [socketId: string]: string;
}


let io: Server | null = null; // Biến io toàn cục

export function setupSocket(server: any): void {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || "http://localhost:5173"], // Chỉ định CORS
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  console.log("🛠 Socket.io initialized!");

  const connectedUsers: ConnectedUsers = {};

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    setTimeout(() => {
      if (io) {
        io.emit("testEvent", { message: "Hello from server!" });
        console.log("📡 Test event emitted!");
      }
    }, 5000);

    connectedUsers[socket.id] = socket.id;

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      delete connectedUsers[socket.id];
    });
  });
}

// ✅ Hàm lấy instance của io, đảm bảo không bị undefined
export function getIo(): Server {
  if (!io) {
    throw new Error(
      "Socket.io chưa được khởi tạo! Hãy gọi setupSocket(server) trước."
    );
  }
  return io;
}
