// import mongoose from "mongoose";
// import passportLocalMongoose from "passport-local-mongoose";

// export const UserSchema = new mongoose.Schema({})

// UserSchema.plugin(passportLocalMongoose)

// const User = mongoose.model('user', UserSchema);

// export default User

import mongoose, { Document, PassportLocalDocument, PassportLocalModel } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface UserDocument extends PassportLocalDocument {
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  });

interface UserModel extends PassportLocalModel<UserDocument> {}

UserSchema.plugin(passportLocalMongoose);

const UserModel: UserModel = mongoose.model<UserDocument>("user", UserSchema);

export default UserModel
