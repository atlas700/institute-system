import mongoose from "mongoose"

const studentsSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    fatherName: { type: String, required: true, minLength: 3 },
    gender: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 10,
    },
    address: { type: String, required: true },
    registrationFees: {
      feesAmount: { type: Number, required: true, default: 0 },
      isPaid: { type: Boolean, required: true, default: false },
      paidAt: { type: Date },
    },
    cardFees: {
      feesAmount: { type: Number, required: true, default: 0 },
      isPaid: { type: Boolean, required: true, default: false },
      paidAt: { type: Date },
    },
    fesses: [
      {
        series: { type: mongoose.Schema.Types.ObjectId, required: true },
        level: { type: mongoose.Schema.Types.ObjectId, required: true },
        seriesName: { type: String, required: true },
        levelName: { type: String, required: true },
        levelFees: { type: Number, required: true, default: 0 },
        levelBookFees: { type: Number, required: true, default: 0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
      },
    ],

    created: { type: Date },
  },
  { timestamps: true }
)

const Student = new mongoose.model("Student", studentsSchema)

export default Student
