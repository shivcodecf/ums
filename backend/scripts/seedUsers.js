import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const users = [
      {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        status: "active",
      },
      {
        name: process.env.MANAGER_NAME,
        email: process.env.MANAGER_EMAIL,
        password: process.env.MANAGER_PASSWORD,
        role: "manager",
        status: "active",
      },
    ];

    for (const user of users) {
      if (!user.email || !user.password) continue;

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await User.create({
          ...user,
          password: hashedPassword,
        });

        console.log(`✅ ${user.role} created successfully`);
      } else {
        console.log(`ℹ️ ${user.role} already exists`);
      }
    }

    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();