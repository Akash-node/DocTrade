import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create the user schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true, // fullName is required
      trim: true, // Removes leading and trailing whitespaces
    },
    userName: {
      type: String,
      required: true,
      unique: true, // userName must be unique
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // email must be unique
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"], // Email format validation
      default: null
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length for password
      match: [
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/,
        "Password must contain at least one uppercase letter, one special character, and one number",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // phoneNumber must be unique
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], // Validate phone number (e.g., for 10-digit numbers)
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Allows only specific values for gender
      default: null
    },
    avatar: {
      type: String, // cloudinary url
      // required: true,
      default: null
    },
    coverImage: {
      type: String, // cloudinary url
      default: null
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRY),
    }
  ); 
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECERT,
    {
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRY),
    }
  );
};

// Export the model
export const User = mongoose.model("User", userSchema);
