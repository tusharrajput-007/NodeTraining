const Student = require("../models/student.model");
const logger = require("../config/logger");

// GET /students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    const success = req.query.success || null;
    res.render("student-list", { students, success });
  } catch (err) {
    logger.error("Error fetching students: " + err.message);
    res.status(500).send("Something went wrong");
  }
};

// GET /students/add
const getAddStudent = (req, res) => {
  res.render("add-student", { error: null });
};

// POST /students/add
const postAddStudent = async (req, res) => {
  try {
    const { name, roll_no, phone, country, state, city } = req.body;

    // Server side validation
    if (!name || name.trim() === "") {
      return res.json({ success: false, message: "Student name is required" });
    }
    if (!roll_no || roll_no.trim() === "") {
      return res.json({ success: false, message: "Roll number is required" });
    }
    if (!phone || phone.trim() === "") {
      return res.json({ success: false, message: "Phone number is required" });
    }
    if (!country || country.trim() === "") {
      return res.json({ success: false, message: "Country is required" });
    }
    if (!state || state.trim() === "") {
      return res.json({ success: false, message: "State is required" });
    }
    if (!city || city.trim() === "") {
      return res.json({ success: false, message: "City is required" });
    }

    const existing = await Student.findOne({ where: { roll_no } });
    if (existing) {
      logger.warn("Duplicate roll number attempt: " + roll_no);
      return res.json({
        success: false,
        message: "Roll number already exists",
      });
    }

    await Student.create({
      name: name.trim(),
      roll_no: roll_no.trim(),
      phone: phone.trim(),
      country: country.trim(),
      state: state.trim(),
      city: city.trim(),
    });
    logger.info("Student added: " + name + " Roll No: " + roll_no);

    res.json({ success: true, message: "Student added successfully" });
  } catch (err) {
    logger.error("Error adding student: " + err.message);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// GET /students/delete/:id
const deleteStudent = async (req, res) => {
  try {
    await Student.destroy({ where: { id: req.params.id } });
    logger.info("Student deleted: ID " + req.params.id);
    res.redirect("/students?success=Student deleted successfully");
  } catch (err) {
    logger.error("Error deleting student: " + err.message);
    res.redirect("/students");
  }
};

module.exports = {
  getAllStudents,
  getAddStudent,
  postAddStudent,
  deleteStudent,
};
