import { Router } from "express"

import {
  addSeries,
  deleteSeriesById,
  getAllSeries,
  getSeriesById,
  getSeriesLevelById,
  updateSeriesById,
  updateSeriesLevels,
  updateSeriesLevelStudentFeesToPaidById,
  addSeriesLevelStudents,
  addSeriesLevelTeachers,
  updateSeriesLevelTeacherSalaryToPaidById,
  deleteStudentFromSeriesLevelById,
  deleteTeacherFromSeriesLevelById,
  updateSeriesLevelById,
  deleteSeriesLevelById,
  getLevelStudentFees,
} from "../controllers/seriesesControllers.js"
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"

const router = Router()

router.route("/").post(auth, admin, addSeries).get(auth, admin, getAllSeries)
router
  .route("/:seriesId")
  .get(auth, admin, getSeriesById)
  .delete(auth, admin, deleteSeriesById)
  .put(auth, admin, updateSeriesById)
router.put("/:seriesId/levels", auth, admin, updateSeriesLevels)
router
  .route("/:seriesId/levels/:levelId")
  .get(auth, admin, getSeriesLevelById)
  .put(auth, admin, updateSeriesLevelById)
  .delete(auth, admin, deleteSeriesLevelById)

// Series Students
router.put(
  "/:seriesId/levels/:levelId/students/add",
  auth,
  admin,
  addSeriesLevelStudents
)
router
  .route("/:seriesId/levels/:levelId/students/:studentId")
  .put(auth, admin, updateSeriesLevelStudentFeesToPaidById)
  .delete(auth, admin, deleteStudentFromSeriesLevelById)
router.get(
  "/:seriesId/levels/:levelId/students/:studentId/fesses/:studentFeesId",
  auth,
  admin,
  getLevelStudentFees
)

// Series Teachers
router.put(
  "/:seriesId/levels/:levelId/teachers/add",
  auth,
  admin,
  addSeriesLevelTeachers
)
router
  .route("/:seriesId/levels/:levelId/teachers/:teacherId")
  .put(auth, admin, updateSeriesLevelTeacherSalaryToPaidById)
  .delete(auth, admin, deleteTeacherFromSeriesLevelById)

export default router
