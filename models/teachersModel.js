import mongoose from "mongoose"

const teachersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    serieses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Series",
      },
    ],
    salaries: [
      {
        series: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        level: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        seriesName: { type: String, required: true },
        levelName: { type: String, required: true },
        levelSalary: { type: Number, required: true, default: 0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
      },
    ],
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxLength: 10,
      minLength: 10,
    },
    created: { type: Date, required: true },
  },

  { timestamps: true }
)

const Teacher = new mongoose.model("Teacher", teachersSchema)

export default Teacher
