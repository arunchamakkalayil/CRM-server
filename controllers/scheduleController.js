const Schedule = require("../models/Meetings");
const { sendEmail } = require('./emailController');


const addScheduleData = async (req, res) => {
  const {
    interviewerName,
    interviewerEmail,
    recipientName,
    recipientEmail,
    meetLink,
    scheduledTime,
  } = req.body;

  try {
    const newMeeting = new Schedule({
      interviewerName,
      interviewerEmail,
      recipientName,
      recipientEmail,
      meetLink,
      scheduledTime,
    });

    // Save the data to the database
    await newMeeting.save();

    // Calculate the time 5 minutes before the scheduled time
    const emailTime = new Date(newMeeting.scheduledTime.getTime() - 5 * 60000);

    // Schedule sending reminder emails 5 minutes before the meeting
    scheduleEmailReminder(interviewerEmail, emailTime, "Meeting Reminder", meetLink, recipientName);
    scheduleEmailReminder(recipientEmail, emailTime, "Meeting Reminder", meetLink, recipientName);

    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
};

// Function to schedule sending reminder email
const scheduleEmailReminder = (email, emailTime, subject,recipientName,meetLink) => {
  const currentTime = new Date();
  const delay = emailTime.getTime() - currentTime.getTime();

  if (delay > 0) {
    // If the delay is positive, schedule sending the email
    setTimeout(async () => {
      try {
        const emailContent = `<h1>Reminder</h1><br><p>Hello ${recipientName},</p><p>Meeting Link</P><a href="${meetLink}">${meetLink}</a>`;
        await sendEmail(email, subject, emailContent);
        console.log('Reminder email sent to:', email);
      } catch (error) {
        console.error('Error sending reminder email:', error);
      }
    }, delay);
  }
};



const getScheduleData = async (req, res) => {
  try {
    const data = await Schedule.find({});
    res.status(200).json({ message: "Data retrieved successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateSchedule = async (req, res) => {
  const scheduleId = req.params.id;
  const { interviewerName, interviewerEmail, recipientName, recipientEmail, meetLink, scheduledTime } = req.body;

  try {
    const updatedMeeting = await Schedule.findByIdAndUpdate(scheduleId, {
      interviewerName,
      interviewerEmail,
      recipientName,
      recipientEmail,
      meetLink,
      scheduledTime,
    }, { new: true });

    if (!updatedMeeting) {
      alert("not")
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting updated successfully", updatedMeeting });
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ error: "Error updating meeting", message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  const scheduleId = req.params.id;

  try {
    const deletedMeeting = await Schedule.findByIdAndDelete(scheduleId);

    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting deleted successfully", deletedMeeting });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ error: "Error deleting meeting" });
  }
};

module.exports = { addScheduleData, getScheduleData, updateSchedule, deleteSchedule };
