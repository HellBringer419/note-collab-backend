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
  Table,
} from "@sequelize/core/decorators-legacy";

@Table({
  defaultScope: {
    attributes: { exclude: ["password"] },
  },
  scopes: {
    includePassword: {
      attributes: { include: ["password"] },
    },
  },
})
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

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password?: string;
}

export default User;
