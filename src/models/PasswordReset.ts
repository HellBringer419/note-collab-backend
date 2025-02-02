import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import {
  Attribute,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
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
  @ForeignKey(() => User)
  declare userId: number;

  @Attribute(DataTypes.DATE)
  declare createdAt: CreationOptional<Date>;
}
User.hasMany(PasswordReset, { foreignKey: "userId" });
PasswordReset.belongsTo(User, { foreignKey: "userId" });

export default PasswordReset;
