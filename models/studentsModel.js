import mongoose from "mongoose"

const studentsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    fatherName: { type: String, required: true },
    gender: { type: String, required: true },
    studentPhone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      minLength: 10,
      maxLength: 10,
    },
    fatherPhone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      minLength: 10,
      maxLength: 10,
    },
    address: { type: String, required: true },
    registeredAt: { type: Date, required: true },
    fees: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    created: { type: Date, required: true, default: Date.now() },
  },
  { timestamps: true }
)

const Student = new mongoose.model("Student", studentsSchema)

export default Student
