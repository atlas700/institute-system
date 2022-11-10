import { Router } from "express"

import {
  login,
  signup,
  getProfile,
  adminUpdateUser,
  adminDeleteUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  getUsers,
  getUserById,
} from "../controllers/usersControllers.js"
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"

const router = Router()

router.get("", auth, admin, getUsers)
router.put("/update/:userId", auth, admin, adminUpdateUser)
router.delete("/delete/:userId", auth, admin, adminDeleteUser)
router.post("/signup", signup)
router.post("/login", login)
router.get("/profile", auth, admin, getProfile)
router.put("/update", auth, admin, updateUser)
router.delete("/delete", auth, admin, deleteUser)
router.delete("/deleteAll", auth, admin, deleteAllUsers)
router.get("/:userId", auth, admin, getUserById)

export default router
