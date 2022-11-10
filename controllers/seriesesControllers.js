import asyncHandler from "express-async-handler"

import Series from "../models/seriesModel.js"
import Student from "../models/studentsModel.js"
import Teacher from "../models/teachersModel.js"

const addSeries = asyncHandler(async (req, res) => {
  const { name, field, seriesStartDate, seriesEndDate, dailyStudyTime } =
    req.body

  const newSeries = new Series({
    name,
    field,
    seriesStartDate,
    seriesEndDate,
    dailyStudyTime,
  })

  if (newSeries) {
    const series = await newSeries.save()
    res.status(201)
    res.json(series)
  } else {
    res.status(404)
    throw new Error("please fill the form to add the series.")
  }
})

const updateSeriesLevels = asyncHandler(async (req, res) => {
  const series = await Series.findById(req.params.seriesId)

  if (series) {
    if (req.body.level) {
      series.levels.push({
        levelName: req.body.level.levelName || null,
        levelTime: req.body.level.levelTime || null,
        levelFees: Number(req.body.level.levelFees),
        levelBookFees: Number(req.body.level.levelBookFees),
        levelSalary: Number(req.body.level.levelSalary),
      })

      await series.save()

      const updatedSeries = await series.save()
      res.json(updatedSeries)
    }
  } else {
    res.status(404)
    throw new Error("no series found by the given id, try again")
  }
})

const updateSeriesLevelById = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    const level = await series.levels.find(
      lev => lev._id.toString() === req.params.levelId.toString()
    )
    if (level) {
      level.levelName = req.body.levelName || level.levelName
      level.levelTime = req.body.levelTime || level.levelTime
      level.levelFees = req.body.levelFees || level.levelFees
      level.levelBookFees = req.body.levelBookFees || level.levelBookFees
      level.levelSalary = req.body.levelSalary || level.levelSalary

      await series.save()

      res.json(series)
    } else {
      res.status(404)
      throw new Error("could not find level by the given id")
    }
  } else {
    res.status(404)
    throw new Error("could not find series by the given id")
  }
})

const deleteSeriesLevelById = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    const levelExist = await series.levels.find(
      lev => lev._id.toString() === req.params.levelId.toString()
    )

    if (levelExist) {
      const filteredLevels = await series.levels.filter(
        lev => lev._id.toString() !== req.params.levelId.toString()
      )

      series.levels = filteredLevels
      await series.save()

      res.json(series)
    } else {
      res.status(404)
      throw new Error("could not find level by the given id")
    }
  } else {
    res.status(404)
    throw new Error("could not find series by the given id")
  }
})

// api/series/:seriesId/levels/:levelId
const addSeriesLevelStudents = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    const level = await series.levels.find(
      l => l._id.toString() === req.params.levelId.toString()
    )

    if (level) {
      if (req.body.levelStudents && req.body.levelStudents.length > 0) {
        if (req.body.levelStudents.length > 1) {
          level.levelStudents.push(...req.body.levelStudents)

          await series.save()

          req.body.level.levelStudents.forEach(async (stu, idx) => {
            const student = await Student.findById(stu)

            student.fesses.push({
              series: series._id,
              level: series.level[idx]._id,
              seriesName: series.name,
              levelName: level.levelName,
              levelFees: Number(level.levelFees),
              levelBookFees: Number(level.levelFees),
            })

            student.serieses.push(series._id)

            return await student.save()
          })

          await series.save()
          res.json(series)
        } else {
          await level.levelStudents.push(req.body.levelStudents[0])

          const student = await Student.findOne({
            _id: req.body.levelStudents[0],
          })

          student.serieses.push(series._id)

          student.fesses.push({
            series: series._id,
            level: level._id,
            seriesName: series.name,
            levelName: level.levelName,
            levelFees: Number(level.levelFees),
            levelBookFees: Number(level.levelBookFees),
          })

          await student.save()

          await series.save()
          return res.json(series)
        }
      } else {
        res.status(404)
        throw new Error(
          "no students data were added please add the data first."
        )
      }
    } else {
      res.status(404)
      throw new Error("no level found in the series by the given id")
    }
  } else {
    res.status(404)
    throw new Error("no series found by the given id")
  }
})

// api/series/:seriesId/levels/levelId/students/studentId
const updateSeriesLevelStudentFeesToPaidById = asyncHandler(
  async (req, res) => {
    const series = await Series.findOne({ _id: req.params.seriesId }).populate(
      "levels.levelStudents"
    )

    const student = await Student.findOne({ _id: req.params.studentId })

    if (series) {
      if (student) {
        const level = await series.levels.find(
          lev => lev._id.toString() === req.params.levelId.toString()
        )

        if (level) {
          const studentFees = await student.fesses.find(
            stuFee => stuFee.level.toString() === level._id.toString()
          )

          if (studentFees) {
            studentFees.isPaid = req.body.isPaid || false
            studentFees.paidAt = req.body.isPaid ? Date.now() : undefined

            await student.save()
          }
        }
      }

      res.json(student)
    } else {
      res.status(404)
      throw new Error("no series found by the given id")
    }
  }
)

const getLevelStudentFees = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId }).populate([
    "levels.levelStudents",
    "levels.levelTeachers",
  ])

  if (series) {
    const level = await series.levels.find(
      lev => lev._id.toString() === req.params.levelId.toString()
    )

    if (level) {
      const student = await level.levelStudents.find(
        stu => stu._id.toString() === req.params.studentId.toString()
      )

      if (student) {
        const studentLevelFees = await student.fesses.find(
          stuFees =>
            stuFees.level.toString() === req.params.levelId.toString() &&
            stuFees._id.toString() === req.params.studentFeesId
        )

        if (studentLevelFees) {
          res.json(studentLevelFees)
        } else {
          res.status(404)
          throw new Error(
            "could not find student level fees in the database by the given id"
          )
        }
      } else {
        res.status(404)
        throw new Error(
          "could not find student in the series level by the given id"
        )
      }
    } else {
      res.status(404)
      throw new Error("could not find level by the given id")
    }
  } else {
    res.status(404)
    throw new Error("could not find series by the given id")
  }
})

// api/series/:seriesId/levels/:levelId/students/:studentId
const deleteStudentFromSeriesLevelById = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    const level = await series.levels.find(
      l => l._id.toString() === req.params.levelId.toString()
    )

    if (level) {
      const student = await level.levelStudents.find(
        stu => stu._id.toString() === req.params.studentId.toString()
      )

      if (student) {
        const filteredLevelStudents = await level.levelStudents.filter(
          stu => stu.toString() !== req.params.studentId.toString()
        )

        const levelIndex = await series.levels.findIndex(
          l => l._id.toString() === req.params.levelId.toString()
        )
        series.levels[levelIndex].levelStudents = filteredLevelStudents

        await series.save()

        const studentFilteredFesses = await student.fesses.filter(
          stuFees => stuFees.level.toString() !== req.params.levelId.toString()
        )

        student.fesses = studentFilteredFesses

        await student.save()

        res.json(series)
      } else {
        res.status(404)
        throw new Error("no student found by the given id")
      }
    } else {
      res.status(404)
      throw new Error("no level found by the given id.")
    }
  } else {
    res.status(404)
    throw new Error("no series found by the given id.")
  }
})

// api/series/:seriesId/levels/:levelId
const addSeriesLevelTeachers = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    const level = await series.levels.find(
      l => l._id.toString() === req.params.levelId.toString()
    )

    if (level) {
      if (req.body.levelTeachers && req.body.levelTeachers.length > 0) {
        if (req.body.levelTeachers.length > 1) {
          level.levelTeachers.push(...req.body.levelTeachers)

          await series.save()

          req.body.level.levelTeachers.forEach(async (tea, idx) => {
            const teacher = await Teacher.findById(tea)

            teacher.salaries.push({
              series: series._id,
              level: series.level[idx]._id,
              seriesName: series.name,
              levelName: level.levelName,
              levelSalary: Number(level.levelFees),
            })

            teacher.serieses.push(series._id)

            return await teacher.save()
          })

          await series.save()
          res.json(series)
        } else {
          await level.levelTeachers.push(req.body.levelTeachers[0])

          const teacher = await Teacher.findOne({
            _id: req.body.levelTeachers[0],
          })

          teacher.serieses.push(series._id)

          teacher.salaries.push({
            series: series._id,
            level: level._id,
            seriesName: series.name,
            levelName: level.levelName,
            levelSalary: Number(level.levelFees),
          })

          await teacher.save()

          await series.save()
          return res.json(series)
        }
      } else {
        res.status(404)
        throw new Error(
          "no Teachers data were added please add the data first."
        )
      }
    } else {
      res.status(404)
      throw new Error("no level found in the series by the given id")
    }
  } else {
    res.status(404)
    throw new Error("no series found by the given id")
  }
})

// api/series/:seriesId/levels/levelId/teachers/teacherId
const updateSeriesLevelTeacherSalaryToPaidById = asyncHandler(
  async (req, res) => {
    const series = await Series.findOne({ _id: req.params.seriesId }).populate(
      "levels.levelTeachers"
    )

    const teacher = await Teacher.findOne({ _id: req.params.teacherId })

    if (series) {
      if (teacher) {
        const level = await series.levels.find(
          lev => lev._id.toString() === req.params.levelId.toString()
        )

        if (level) {
          const teacherSalary = await teacher.salaries.find(
            teaSalary => teaSalary.level.toString() === level._id.toString()
          )

          if (teacherSalary) {
            teacherSalary.isPaid = req.body.isPaid || false
            teacherSalary.paidAt = req.body.isPaid ? Date.now() : undefined

            await teacher.save()
          }
        }
      }

      res.json(teacher)
    } else {
      res.status(404)
      throw new Error("no series found by the given id")
    }
  }
)

// api/series/:seriesId/levels/:levelId/teachers/:teacherId
const deleteTeacherFromSeriesLevelById = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    const level = await series.levels.find(
      l => l._id.toString() === req.params.levelId.toString()
    )

    if (level) {
      const teacher = await level.levelTeachers.find(
        tea => tea._id.toString() === req.params.teacherId.toString()
      )

      if (teacher) {
        const filteredLevelTeachers = await level.levelTeachers.filter(
          tea => tea.toString() !== req.params.teacherId.toString()
        )

        const levelIndex = await series.levels.findIndex(
          l => l._id.toString() === req.params.levelId.toString()
        )
        series.levels[levelIndex].levelTeachers = filteredLevelTeachers

        await series.save()

        const teacherFilteredSalaries = await teacher.salaries.filter(
          teaSal => teaSal.level.toString() !== req.params.levelId.toString()
        )

        teacher.salaries = teacherFilteredSalaries

        await teacher.save()

        res.json(series)
      } else {
        res.status(404)
        throw new Error("no teacher found by the given id")
      }
    } else {
      res.status(404)
      throw new Error("no level found by the given id.")
    }
  } else {
    res.status(404)
    throw new Error("no series found by the given id.")
  }
})

const getSeriesById = asyncHandler(async (req, res) => {
  const series = await Series.find({ _id: req.params.seriesId }).populate([
    "levels.levelStudents",
    "levels.levelTeachers",
  ])

  if (series) {
    res.json(series)
  } else {
    res.status(404)
    throw new Error("no series found by the given id, try again")
  }
})

const getAllSeries = asyncHandler(async (req, res) => {
  const serieses = await Series.find().populate([
    "levels.levelStudents",
    "levels.levelTeachers",
  ])

  if (serieses && serieses.length > 0) {
    res.json(serieses)
  } else {
    res.status(404)
    throw new Error("no serieses found in teh database")
  }
})

const getSeriesLevelById = asyncHandler(async (req, res) => {
  const series = await Series.findById(req.params.seriesId).populate([
    "levels.levelStudents",
    "levels.levelTeachers",
  ])

  if (series) {
    const seriesLevel = series.levels.find(
      level => level._id.toString() === req.params.levelId.toString()
    )

    res.json(seriesLevel)
  } else {
    res.status(404)
    throw new Error("no series found by the given id")
  }
})

const deleteSeriesById = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId }).populate([
    "levels.levelStudents",
    "levels.levelTeachers",
  ])

  const students = await Student.find()
  const teachers = await Teacher.find()

  if (series) {
    if (students) {
      await students.forEach(async stu => {
        const filteredSerieses = await stu.serieses.filter(
          stuSer => stuSer.toString() !== series._id.toString()
        )

        stu.serieses = filteredSerieses

        const filteredFesses = await stu.fesses.filter(
          stuFees => stuFees.series.toString() !== series._id.toString()
        )

        stu.fesses = filteredFesses

        return await stu.save()
      })
    }

    if (teachers) {
      await teachers.forEach(async tea => {
        const filteredSerieses = await tea.serieses.filter(
          teaSer => teaSer.toString() !== series._id.toString()
        )

        tea.serieses = filteredSerieses

        const filteredSalaries = await tea.salaries.filter(
          teaSal => teaSal.series.toString() !== series._id.toString()
        )

        tea.salaries = filteredSalaries

        return await tea.save()
      })
    }

    await series.remove()
    res.json("Successfully Deleted")
  } else {
    res.status(404)
    throw new Error("no series found by the given id")
  }
})

const updateSeriesById = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ _id: req.params.seriesId })

  if (series) {
    series.name = req.body.name || series.name
    series.field = req.body.field || series.field
    series.seriesStartDate = req.body.seriesStartDate || series.seriesStartDate
    series.seriesEndDate = req.body.seriesEndDate || series.seriesEndDate
    series.dailyStudyTime = req.body.dailyStudyTime || series.dailyStudyTime

    const updatedSeries = await series.save()

    res.json(updatedSeries)
  } else {
    res.status(404)
    throw new Error("no series found by the given id")
  }
})

export {
  addSeries,
  getSeriesById,
  getAllSeries,
  getSeriesLevelById,
  updateSeriesLevels,
  updateSeriesLevelById,
  deleteSeriesLevelById,
  deleteSeriesById,
  updateSeriesById,
  addSeriesLevelStudents,
  updateSeriesLevelStudentFeesToPaidById,
  deleteStudentFromSeriesLevelById,
  getLevelStudentFees,
  addSeriesLevelTeachers,
  deleteTeacherFromSeriesLevelById,
  updateSeriesLevelTeacherSalaryToPaidById,
}
