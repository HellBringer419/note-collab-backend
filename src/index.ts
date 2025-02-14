import { Server } from "socket.io";
import app from "./app";
import sequelize from "./datasource";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import Note from "./models/Note";
import { SocketErrorResponse } from "./interfaces/ErrorResponse";
import { verifyUserWS } from "./middlewares/verify-user";

const port = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key"; // Replace with your actual secret key

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  connectionStateRecovery: {
    skipMiddlewares: true,
  },
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("Listening to socket connections");

  socket.on(
    "subscribe-note",
    async (payload: number, callback: (t: SocketErrorResponse) => void) => {
      if (!payload || typeof payload !== "number") {
        return callback({
          status: "Bad Request",
          error: new Error("Unaccepted payload"),
        });
      }

      if (typeof callback !== "function") {
        // not an acknowledgement
        return socket.disconnect();
      }

      const note = await Note.findByPk(payload);
      if (!note) {
        return callback({
          status: "Bad Request",
          error: new Error("Note not found"),
        });
      }

      socket.join(`note_${note.id}`);
      return callback({
        status: "Success",
      });
    },
  );

  socket.on("unsubscribe-note", async (payload: number) => {
    if (!payload || typeof payload !== "number") {
      console.error("Tried to unsubscribe-note without correct payload");
      return;
    }
    socket.leave(`note_${payload}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.use(verifyUserWS);


httpServer.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // await sequelize.sync({ force: true });
    // console.log("sycned");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
