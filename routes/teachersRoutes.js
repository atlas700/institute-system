import { Router } from "express"

import {
  addTeacher,
  deleteTeacher,
  deleteTeachers,
  getReports,
  getTeacher,
  getTeachers,
  updateTeacher,
} from "../controllers/teachersControllers.js"
import admin from "../middlewares/admin.js"
import auth from "../middlewares/auth.js"

const router = Router()

router
  .route("/")
  .post(auth, addTeacher)
  .get(auth, getTeachers)
  .delete(auth, admin, deleteTeachers)
router.get("/reports", auth, admin, getReports)
router
  .route("/:teacherId")
  .get(auth, getTeacher)
  .put(auth, updateTeacher)
  .delete(auth, deleteTeacher)

export default router
