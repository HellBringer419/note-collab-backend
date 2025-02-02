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
  @ForeignKey(() => User)
  declare userId: number;

  @Attribute(DataTypes.INTEGER)
  @ForeignKey(() => Note)
  declare noteId: number;
}
User.belongsToMany(Note, { through: Collaboration, foreignKey: "userId" });
Note.belongsToMany(User, { through: Collaboration, foreignKey: "noteId" });
export default Collaboration;
