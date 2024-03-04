const Schedule = require("../models/Meetings");
const Customer = require("../models/Customerdata");

getData = async (req, res) => {
  try {
    // Fetch data from your MongoDB collection
    const data = await Customer.find({});
    console.log(data); // Logging the data before sending the response
    res.status(200).json({ message: "success", data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
};

deleteData = async (req, res) => {

  const itemId = req.params.itemId;
 
  try {
    // Use Mongoose to find and remove the item by its ID
    const deletedItem = await Customer.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting item" });
  }
};

addData = async (req, res) => {
  const { name, email, phone,month, status } = req.body;

  try {
    // Create a new instance of the Data model
    const newData = new Customer({
      name,
      email,
      phone,
      month,
      status,
    });

    // Save the data to the database
    await newData.save();

    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
      // Duplicate email address error
      res.status(400).json({ error: "Email address already exists" });
    } else {
      // Other MongoDB errors
      console.error("Error saving data:", error);
      res.status(500).json({ error: "Error saving data" });
    }
  }
};

updateDate = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, status } = req.body;
console.log("hoooo")
  try {
    const updatedData = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone, status },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res.status(200).json(updatedData);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
      // Duplicate email address error
      res.status(400).json({ error: "Email address already exists" });
    } else {
      // Other MongoDB errors
      console.error("Error saving data:", error);
      res.status(500).json({ error: "Error saving data" });
    }
  }
};

countData=async(req,res)=>{

  try {
    const closedLeadsCount = await Customer.countDocuments({ status: "closed" });
    const pendingLeadsCount = await Customer.countDocuments({ status: "pending" });
    const notConnectedLeadsCount = await Customer.countDocuments({ status: "not_connected" });
    const lostCount = await Customer.countDocuments({ status: "lost" });
    const totalLeadsCount = closedLeadsCount + pendingLeadsCount + notConnectedLeadsCount + lostCount;

  res.status(200).json({
      status: "success",
      data: {
        closed: closedLeadsCount,
        pending: pendingLeadsCount,
        not_connected: notConnectedLeadsCount,
        lost:lostCount,
        total: totalLeadsCount,
      },
    });
  } catch (error) {
    console.error(error);
   res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getData, deleteData, addData, updateDate , countData};
