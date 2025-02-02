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
export class NoteHistory extends Model<
  InferAttributes<NoteHistory>,
  InferCreationAttributes<NoteHistory>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare noteId: number;

  @BelongsTo(() => Note, "noteId")
  declare Note?: NonAttribute<Note>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare changedBy: number;

  @BelongsTo(() => User, "changedBy")
  declare ChangedBy?: NonAttribute<User>;

  @Attribute(DataTypes.STRING)
  declare prevTitle: string;

  @Attribute(DataTypes.STRING)
  declare prevDescription: string;

  @Attribute(DataTypes.STRING)
  declare newTitle: string;

  @Attribute(DataTypes.STRING)
  declare newDescription: string;

  @Attribute(DataTypes.DATE)
  declare createdAt: CreationOptional<Date>;
}

export default NoteHistory;
