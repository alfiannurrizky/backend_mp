const mongoose = require('mongoose');
const { Schema } = mongoose;

const programStudiSchema = new Schema({
    fakultas: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

// MongoDB otomatis memberikan _id unik (ObjectId)
const ProgramStudi = mongoose.model('ProgramStudi', programStudiSchema);

module.exports = ProgramStudi;
