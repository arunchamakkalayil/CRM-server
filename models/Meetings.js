const mongoose = require('mongoose');

// Define the schema
const scheduleSchema = new mongoose.Schema({
  interviewerName: {
    type: String,
    required: true,
  },
  interviewerEmail: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  meetLink: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
});

// Create the model
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
