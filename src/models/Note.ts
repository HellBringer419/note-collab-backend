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
  HasMany,
} from "@sequelize/core/decorators-legacy";
import User from "./User";
import Collaboration from "./Collaboration";

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

  @Attribute(DataTypes.TEXT)
  declare description: string | null;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare createdBy: number;

  @BelongsTo(() => User, "createdBy")
  declare CreatedBy?: NonAttribute<User>;

  @HasMany(() => Collaboration, "noteId")
  declare Collaborations?: NonAttribute<Collaboration[]>;

  // Timestamps
  @Attribute(DataTypes.DATE)
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  declare updatedAt: CreationOptional<Date>;
}
export default Note;
