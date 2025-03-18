import { model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods } from "../types/type";

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    googleId: {
      type: String,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: { googleId: { $exists: true, $ne: null } },
      },
    },
    githubId: {
      type: String,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: { githubId: { $exists: true, $ne: null } },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
