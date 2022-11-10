import { Router } from "express"

import {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudents,
  deleteStudent,
  getOneMonthReports,
  getOneYearReports,
  getOneWeekReports,
  getOneDayReports,
  getAllStudents,
} from "../controllers/studentsControllers.js"
import admin from "../middlewares/admin.js"
import auth from "../middlewares/auth.js"

const router = Router()

router
  .route("/")
  .post(auth, addStudent)
  .get(auth, getStudents)
  .delete(auth, admin, deleteStudents)
router.get("/allStudents", getAllStudents)
router.get("/reports/yearly", auth, admin, getOneYearReports)
router.get("/reports/monthly", auth, admin, getOneMonthReports)
router.get("/reports/weekly", auth, admin, getOneWeekReports)
router.get("/reports/daily", auth, admin, getOneDayReports)
router
  .route("/:studentId")
  .get(auth, getStudent)
  .put(auth, admin, updateStudent)
  .delete(auth, admin, deleteStudent)
export default router
