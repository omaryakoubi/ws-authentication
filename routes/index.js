const router = require("express").Router();
const Contact = require("../models/Contact");

//Create
router.post("/createContact", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, age } = req.body;
    const contact = await Contact.create({ fullName, email, phoneNumber, age });
    res.status(201).json({
      status: true,
      message: "You new contact has been created",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err });
  }
});

//Read
router.get("/contactList", async (req, res) => {
  try {
    const contactList = await Contact.find({});
    res.status(200).json({
      status: true,
      message: "Contact list",
      data: contactList,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err });
  }
});

//Update
router.put("/editContact/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(id, {
      ...req.body,
    });

    res.status(200).json({
      status: true,
      message: "Contact updated",
      data: updatedContact,
    });
    res.send("testing put request");
  } catch (err) {
    res.status(500).json({ status: false, message: err });
  }
});

//Delete
router.delete("/deleteContact/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (contact) {
      await Contact.findByIdAndDelete(id);
      res.status(200).json({
        status: true,
        message: "Contact deleted",
        data: contact,
      });
    } else {
      res
        .status(404)
        .json({ status: false, message: "Sorry contact not found" });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: err });
  }
});

module.exports = router;
