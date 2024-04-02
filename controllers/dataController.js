const Schedule = require("../models/Meetings");
const Customer = require("../models/Customerdata");

getData = async (req, res) => {
  try {
    // Fetch data from your MongoDB collection
    const data = await Customer.find({});
// Logging the data before sending the response
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
  console.log(req.body)
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
  const { name, email, phone, status ,month} = req.body;
console.log("hoooo")
  try {
    const updatedData = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone, status,month },
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

countData = async (req, res) => {
  try {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dataByMonth = {};

    for (const month of months) {
      const data = await Customer.find({ month: month });

      dataByMonth[month] = data;
    }
console.log(dataByMonth)
    res.status(200).json({
      status: "success",
      data: dataByMonth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



addExcel = async (req, res) => {
  try {
    const excelData = req.body.data.slice(1); // Skip the first array (column headers)

    // Loop through each data array
    for (let data of excelData) {
      const [name, email, phone, month, status] = data; // Destructure the data array

      // Create a new instance of the Customer model
      const newData = new Customer({
        name,
        email,
        phone,
        month,
        status,
      });

      // Save the data to the database
      await newData.save();
    }

    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      // Duplicate email address error
      res.status(400).json({ error: "Duplicate email address: " + error.keyValue.email });
    } else {
      // Other MongoDB errors
      console.error("Error saving data:", error);
      res.status(500).json({ error: "Error saving data" });
    }
  }
};
monthCount = async (req, res) => {
  try {
    // Initialize an object to store the count of leads for each month
    const monthCounts = {};

    // Fetch all the leads from the database
    const allLeads = await Customer.find({});

    // Loop through each lead and count the leads for each month
    allLeads.forEach(lead => {
      const { month } = lead;
      // If the month already exists in the monthCounts object, increment its count by 1
      if (monthCounts.hasOwnProperty(month)) {
        monthCounts[month]++;
      } else {
        // If the month doesn't exist in the monthCounts object, initialize its count to 1
        monthCounts[month] = 1;
      }
    });
console.log(monthCounts)
    res.status(200).json({ status: "success", data: monthCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = { getData, deleteData, addData, addExcel, updateDate , countData,monthCount};
