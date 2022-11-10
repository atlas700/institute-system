import mongoose from "mongoose"

const levelsSchema = new mongoose.Schema(
  {
    levelName: { type: String, required: true },
    levelTime: { type: String, required: true },
    levelFees: { type: Number, required: true, default: 0 },
    levelBookFees: { type: Number, required: true, default: 0 },
    levelSalary: { type: Number, required: true, default: 0 },
    levelStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
      },
    ],
    levelTeachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
)

const seriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  field: { type: String, required: true },
  seriesStartDate: { type: Date, required: true },
  seriesEndDate: { type: Date, required: true },
  dailyStudyTime: { type: String, required: true },
  levels: [levelsSchema],
})

const Series = new mongoose.model("Series", seriesSchema)

export default Series
