import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

// import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "", role, status } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "") {
      query.role = role;
    }

    if (status && status !== "") {
      query.status = status;
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { name, email, role, status } = req.body;
//     const userId = req.params.id;
//     const loggedInUser = req.user;

//     // 🔐 Authentication Check
//     if (!loggedInUser) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // 🔍 Find Target User
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     /**
//      * 🔒 Authorization Rules
//      * - Admin: Can update anyone.
//      * - Manager: Can update only non-admin users.
//      * - User: Can update only their own profile.
//      */
//     if (loggedInUser.role === "user") {
//       if (loggedInUser.id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access denied",
//         });
//       }
//     }

//     if (loggedInUser.role === "manager" && user.role === "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Managers cannot modify admin accounts",
//       });
//     }

//     // 📧 Check for Duplicate Email
//     if (email && email !== user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser && existingUser._id.toString() !== userId) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already in use",
//         });
//       }
//       user.email = email;
//     }

//     // ✏️ Update Basic Fields
//     if (name) user.name = name;

//     /**
//      * 🛡️ Role & Status Updates
//      * - Only Admin can update role and status
//      */
//     if (loggedInUser.role === "admin") {
//       if (role) user.role = role;
//       if (status) user.status = status;
//     }

//     // 🚫 Prevent Manager/User from modifying role or status
//     if (
//       (loggedInUser.role === "manager" || loggedInUser.role === "user") &&
//       (role || status)
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to update role or status",
//       });
//     }

//     // 💾 Save Updated User
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//     });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     return res.status(500).json({
//       success: false,
//       message:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Internal server error",
//     });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const userId = req.params.id;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const loggedInUserId = loggedInUser._id?.toString() || loggedInUser.id;

    // Find target user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.role === "user" && loggedInUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (loggedInUser.role === "manager" && user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Managers cannot modify admin accounts",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
      user.email = email;
    }

    if (name) user.name = name;

    if (loggedInUser.role === "admin") {
      if (role) user.role = role;
      if (status) user.status = status;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user is not found",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;

    if (!name || !email || !role || !status || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "user already exists",
      });
    }

    const user = await User.create({
      name: name,
      email: email,
      role: role,
      status,
      password: hashedPassword,
    });

    user.password = undefined;

    return res.status(201).json({
      user,
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server erorr",
    });
  }
};

export const ownUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user is not found",
      });
    }

    user.password = undefined;

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server erorr",
    });
  }
};

export const updateOwnProfile = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const id = req.user.id;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    
    if (!name && !password && !email) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (name) {
      user.name = name;
    }

    // Update password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update email (restricted for normal users)
    if (email) {
      if (user.role === "user") {
        return res.status(403).json({
          success: false,
          message: "Access denied! Users cannot update their email.",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }

      user.email = email;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Own Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
