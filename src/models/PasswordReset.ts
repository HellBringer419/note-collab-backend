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
  BelongsTo,
  NotNull,
} from "@sequelize/core/decorators-legacy";
import User from "./User";

export class PasswordReset extends Model<
  InferAttributes<PasswordReset>,
  InferCreationAttributes<PasswordReset>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  declare otp: number;

  @Attribute(DataTypes.DATE)
  declare expiry: Date;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number;

  @BelongsTo(() => User, "userId")
  declare User?: NonAttribute<User>;

  @Attribute(DataTypes.DATE)
  declare createdAt: CreationOptional<Date>;
}

export default PasswordReset;
