const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Contact = require("../models/Contact");
const User = require("../models/User");

const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @route POST /createUser
 * @description Create a new user
 * @access public
 */

router.post("/createUser", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        res.status(500).json({ status: false, message: err });
      } else if (hash) {
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hash,
        });
        res
          .status(201)
          .json({ status: true, message: "user created", data: user });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
});

/**
 * @route POST /login
 * @description Logs in a user
 * @access public
 */

router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          res.status(500).json({ status: false, message: err });
        } else if (result) {
          const token = jwt.sign(
            { id: user._id, email },
            process.env.SECRET_TOKEN,
            {
              expiresIn: "30s",
            }
          );
          res
            .status(200)
            .json({ status: true, message: "you are logged in", data: token });
        } else {
          res
            .status(401)
            .json({ staus: false, message: "invalid credentials" });
        }
      });
    } else {
      res.status(404).json({ status: false, message: "invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
});

/**
 * @route POST /createContact
 * @description Create a new contact
 * @access private
 */

router.post("/createContact", verifyToken, async (req, res) => {
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

/**
 * @route GET /contactList
 * @description Retrive all existing contacts
 * @access private
 */

router.get("/contactList", verifyToken, async (req, res) => {
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

/**
 * @route PUT /editContact/:id
 * @description Edit a specific contact using the contact ID
 * @access private
 */

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

/**
 * @route DELETE /deleteContact/:id
 * @description Delete a specific contact using the contact ID
 * @access private
 */

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
