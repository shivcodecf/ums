import express from "express";
import {
  createUser,
  getAllUsers,
  ownUserProfile,
  updateOwnProfile,
  updateProfile,
} from "../controllers/users.controllers.js";

import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/admin")
  .get(protect, authorizeRoles("admin", "manager"), getAllUsers);

router
  .route("/me/:id")
  .put(protect, authorizeRoles("admin", "manager"), updateProfile);

// router.put(
//   "/users/:id",
//   protect,
//   authorizeRoles("admin", "manager"),
//   updateProfile
// );

router
  .route("/admin/me/:id")
  .put(protect, authorizeRoles("admin", "manager"), updateProfile);

router
  .route("/admin/create")
  .post(protect, authorizeRoles("admin"), createUser);

router
  .route("/user")
  .get(protect, authorizeRoles("user", "admin", "manager"), ownUserProfile);

router
  .route("/user/update")
  .put(protect, authorizeRoles("user", "admin", "manager"), updateOwnProfile);

export default router;
