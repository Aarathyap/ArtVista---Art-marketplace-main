const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
      },
      profileImage: {
        type: String,
        required: true,
      },
      wishlist: {
        type: Array,
        default: [],
      },
      cart: {
        type: Array,
        default: [],
      },
      orders: {
        type: Array,
        default: [],
      },
      works: {
        type: Array,
        default: [],
      },
      role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User  = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;