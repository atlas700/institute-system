import { Router } from "express"

import {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudents,
  deleteStudent,
  getReports,
  getSpecificUserStudents,
} from "../controllers/studentsControllers.js"
import admin from "../middlewares/admin.js"
import auth from "../middlewares/auth.js"

const router = Router()

router
  .route("/")
  .post(auth, addStudent)
  .get(auth, getStudents)
  .delete(auth, admin, deleteStudents)
router.get("/reports", auth, admin, getReports)
router
  .route("/:studentId")
  .get(auth, getStudent)
  .put(auth, updateStudent)
  .delete(auth, deleteStudent)
router.get("/user/userId", auth, getSpecificUserStudents)
export default router
