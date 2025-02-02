import fs from "fs";
import { ModelStatic, Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import path from "path";

const models = {};
const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: "mydb",
  user: "myuser",
  password: "mypass",
  host: "localhost",
  port: 5432,
  ssl: true,
  clientMinMessages: "notice",
  models: [],
});
