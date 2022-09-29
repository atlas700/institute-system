import mongoose from "mongoose"

const teachersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
      maxLength: 10,
      minLength: 10,
    },
    salary: { type: Number, required: true, trim: true },
    teachingField: { type: String, required: true },
    attendanceTime: { type: String, required: true },
    created: { type: Date, required: true, default: Date.now() },

    rolledAt: { type: Date, required: true },
  },

  { timestamps: true }
)

const Teacher = new mongoose.model("Teacher", teachersSchema)

export default Teacher
