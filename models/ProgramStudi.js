const mongoose = require("mongoose");
const { Schema } = mongoose;

const programStudiSchema = new Schema(
  {
    fakultas: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const ProgramStudi = mongoose.model("ProgramStudi", programStudiSchema);

module.exports = ProgramStudi;
