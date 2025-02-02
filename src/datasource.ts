import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import Collaboration from "./models/Collaboration";
import Note from "./models/Note";
import NoteHistory from "./models/NoteHistory";
import PasswordReset from "./models/PasswordReset";
import User from "./models/User";

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB_NAME ?? "mydb",
  user: process.env.DB_USER ?? "myuser",
  password: process.env.DB_PASSWD ?? "mypass",
  host: process.env.DB_HOST ?? "localhost",
  port: 18573,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CERT,
  },
  clientMinMessages: "notice",
  models: [Collaboration, Note, NoteHistory, PasswordReset, User],
});

export default sequelize;
