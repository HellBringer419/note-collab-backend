import { Server } from "socket.io";
import app from "./app";
import sequelize from "./datasource";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import Note from "./models/Note";
import { SocketErrorResponse } from "./interfaces/ErrorResponse";

const port = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key"; // Replace with your actual secret key

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  connectionStateRecovery: {
    skipMiddlewares: true,
  },
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", async (socket) => {
  console.log("Listening to socket connections");

  socket.on("subscribe-note", async (payload: number, callback: (t: SocketErrorResponse) => void) => {
    if (!payload || typeof payload !== "number") {
      return callback({
        status: "Bad Request",
        error: new Error("Unaccepted payload")
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
        error: new Error("Note not found")
      });
    }

    socket.join(`note_${note.id}`);
    return callback({
      status: "Success",
    })
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// io.use(async (socket, next) => {
//   let token = String(socket.handshake.auth.token);
//   if (!token) {io.use(async (socket, next) => {
//   let token = String(socket.handshake.auth.token);
//   if (!token) {
//     next(new Error("MIssing Token"));
//   }

//   console.log(token, "from WS");
//   console.log({ JWT_SECRET });
  
//   // Verify the token (you can use your existing authentication logic)
//   try {
//     // Verify the token using JWT secret key
//     // FIXME: check the difference in the token
//     const user = jwt.verify(token, JWT_SECRET) as { id: number }; // Assuming the token contains user ID
//     if (!user) {
//       next(new Error("Authentication error"));
//     }

//     // Attach the user to the socket for later use
//     socket.data.user = user;
//     next();
//   } catch (error) {
//     if (error instanceof Error) next(error);
//     else next(new Error("Unknown authentication error"));
//   }
// });
//     next(new Error("MIssing Token"));
//   }

//   console.log(token, "from WS");
//   console.log({ JWT_SECRET });
  
//   // Verify the token (you can use your existing authentication logic)
//   try {
//     // Verify the token using JWT secret key
//     // FIXME: check the difference in the token
//     const user = jwt.verify(token, JWT_SECRET) as { id: number }; // Assuming the token contains user ID
//     if (!user) {
//       next(new Error("Authentication error"));
//     }

//     // Attach the user to the socket for later use
//     socket.data.user = user;
//     next();
//   } catch (error) {
//     if (error instanceof Error) next(error);
//     else next(new Error("Unknown authentication error"));
//   }
// });

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
