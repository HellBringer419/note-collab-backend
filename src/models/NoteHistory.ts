import {
  Sequelize,
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
  @ForeignKey(() => Note)
  declare noteId: number;

  @Attribute(DataTypes.INTEGER)
  @ForeignKey(() => User)
  declare changedBy: number;

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

User.hasMany(NoteHistory, { foreignKey: "changedBy" });
NoteHistory.belongsTo(User, { foreignKey: "changedBy" });
Note.hasMany(NoteHistory, { foreignKey: "noteId" });
NoteHistory.belongsTo(Note, { foreignKey: "noteId" });

export default NoteHistory;
