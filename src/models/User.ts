import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
} from "@sequelize/core/decorators-legacy";
import { Note } from "./Note";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  declare avatar: string | null;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.DATE)
  declare joinedOn: CreationOptional<Date>;
}
User.hasMany(Note, { foreignKey: "createdBy" });

export default User;
