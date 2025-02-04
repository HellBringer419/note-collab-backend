import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import User from "./User";
import Note from "./Note";

export class Collaboration extends Model<
  InferAttributes<Collaboration>,
  InferCreationAttributes<Collaboration>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number;

  @BelongsTo(() => User, "userId")
  declare User: NonAttribute<User>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare noteId: number;

  @BelongsTo(() => Note, "noteId")
  declare Note?: NonAttribute<Note>;
}

export default Collaboration;
