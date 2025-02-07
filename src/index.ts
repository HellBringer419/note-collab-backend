import { Server } from "socket.io";
import app from "./app";
import sequelize from "./datasource";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import Note from "./models/Note";

const port = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key"; // Replace with your actual secret key

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  connectionStateRecovery: {
    skipMiddlewares: true,
  },
});

io.on("connection", async (socket) => {
  console.log("Listening to socket connections");

  socket.on("subscribe-note", async (payload: number) => {
    if (!payload || typeof payload !== "number") {
      throw new Error("Unaccepted payload");
    }

    const note = await Note.findByPk(payload);
    if (!note) {
      throw new Error("Note not found");
    }

    socket.join(`note_${note.id}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
io.use(async (socket, next) => {
  let token = String(socket.handshake.query.token);
  if (!token) {
    next(new Error("Authentication error"));
  }

  // Verify the token (you can use your existing authentication logic)
  try {
    // Verify the token using JWT secret key
    const user = jwt.verify(token, JWT_SECRET) as { id: number }; // Assuming the token contains user ID
    if (!user) {
      next(new Error("Authentication error"));
    }

    // Attach the user to the socket for later use
    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

httpServer.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
