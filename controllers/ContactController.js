const Contact = require("../models/Contact");
const addContactData = async (req, res) => {
  const {
    name,
    place,
    phone,
  } = req.body;

  try {
    const newContact = new Contact({
      name,
      place,
      phone,
    });

    // Save the data to the database
    await newContact.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
};


const getContactData = async (req, res) => {
  try {
    const data = await Contact.find({});
    res.status(200).json({ message: "Data retrieved successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateContact = async (req, res) => {
  const contactId = req.params.id;
  const {     name,
    place,
    phone, } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, {
      name,
      place,
      phone,
    }, { new: true });

    if (!updatedContact) {
      alert("not")
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting updated successfully", updatedContact });
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ error: "Error updating meeting", message: error.message });
  }
};

const deleteContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting deleted successfully", deletedContact });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ error: "Error deleting meeting" });
  }
};

const getContacts = async (req, res) => {
  try {
    const { place } = req.query;
    console.log('Received place:', place);

    if (!place) {
      return res.status(400).json({ error: 'Place is required' });
    }
    // Find contacts matching the place
    const contacts = await Contact.find({ place })
    console.log('Found contacts:', contacts);

    if (contacts.length === 0) {
      return res.status(404).json({ error: 'No contacts found for this place' });
    }

    // Map the contacts to desired fields
    const contactDetails = contacts.map(contact => ({ name: contact.name, phone: contact.phone }));

    res.status(200).json({ contactDetails });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






module.exports = { addContactData, getContactData, updateContact, deleteContact, getContacts };
