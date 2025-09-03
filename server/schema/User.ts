// /server/schema/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    image: String,
    emailVerified: Boolean,
  },
  {
    timestamps: true,
    collection: 'user', // ✅ strictly 'user'
  }
);

const User = models.User || model('User', UserSchema);

export default User;
