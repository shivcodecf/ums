import { User } from "../models/user.model.js";

import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { generateCookie } from "../utils/generateCookie.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid EmailId or password",
      });
    }

    // const checkStatus = await User.findOne({ status: "inactive" });

    if (user.status == "inactive") {
      return res.status(400).json({
        success: false,
        message: "User is inactive",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "invalid emailId or Password",
      });
    }

    const token = generateToken({ id: user._id, role: user.role });

    generateCookie(res, token);

    return res.status(200).json({
      user,
      success: true,
      message: "user login successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required!",
      });
    }

    const existinguUser = await User.findOne({ email });

    if (existinguUser) {
      return res.status(400).json({
        success: false,
        message: "user is already exists, plz login ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    user.password = undefined;

    return res.status(201).json({
      user,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Use res.clearCookie for better readability,
    // but ensure the options match generateCookie exactly
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // path: "/" // Ensure the path matches if you set one specifically before
      })
      .json({
        success: true,
        message: "Log out successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "failed to logout",
    });
  }
};
