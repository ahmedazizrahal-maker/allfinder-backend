import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import searchRoutes from "./routes/search.routes";
import http from "http";
import { Server } from "socket.io";
import Chat from "./models/Chat";
import adminRoutes from "./routes/admin.routes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (placeId) => {
    socket.join(placeId);
  });

  socket.on("send_message", async ({ placeId, userId, text }) => {
    const chat = await Chat.findOneAndUpdate(
      { placeId },
      {
        $push: {
          messages: {
            from: userId ? "user" : "guest",
            text,
            timestamp: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    io.to(placeId).emit("receive_message", chat.messages.at(-1));
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "allFinder backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
