const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  Username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  PhoneNumber: {
    type: String,
    required: [true, "Phone Number is required"],
    unique: true,
    trim: true,
  },
  Password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  Image: {
    type: String,
    required: [true, "Image is required!"],
  },
  Role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
},
{
  timestamps: true,
});

const User = new mongoose.model("User", UsersSchema);

module.exports = User;