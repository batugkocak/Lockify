import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  username?: string;
  passwordHash: string;
  roles: string[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email must be provided!"],
    unique: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
      "Please fill a valid username.",
    ],
  },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ["user"] },
});

const User = model<IUser>("User", userSchema);

export { IUser, User };
