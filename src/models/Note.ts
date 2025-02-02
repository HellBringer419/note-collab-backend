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
  ForeignKey,
} from "@sequelize/core/decorators-legacy";
import User from "./User"; // assuming User model is in the same folder

export class Note extends Model<
  InferAttributes<Note>,
  InferCreationAttributes<Note>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare description: string;

  @Attribute(DataTypes.INTEGER)
  @ForeignKey(() => User)
  declare createdBy: number;

  // Timestamps
  @Attribute(DataTypes.DATE)
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  declare updatedAt: CreationOptional<Date>;
}
Note.belongsTo(User, { foreignKey: "createdBy" });
export default Note;
