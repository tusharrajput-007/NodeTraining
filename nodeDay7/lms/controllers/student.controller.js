const Student = require("../models/student.model");

// GET /students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.render("student-list", { students });
  } catch (err) {
    console.error(err);
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
      return res.render("add-student", { error: "Student name is required" });
    }
    if (!roll_no || roll_no.trim() === "") {
      return res.render("add-student", { error: "Roll number is required" });
    }
    if (!phone || phone.trim() === "") {
      return res.render("add-student", { error: "Phone number is required" });
    }
    if (!country || country.trim() === "") {
      return res.render("add-student", { error: "Country is required" });
    }
    if (!state || state.trim() === "") {
      return res.render("add-student", { error: "State is required" });
    }
    if (!city || city.trim() === "") {
      return res.render("add-student", { error: "City is required" });
    }

    // Check duplicate roll number
    const existing = await Student.findOne({ where: { roll_no } });
    if (existing) {
      return res.render("add-student", { error: "Roll number already exists" });
    }

    await Student.create({
      name: name.trim(),
      roll_no: roll_no.trim(),
      phone: phone.trim(),
      country: country.trim(),
      state: state.trim(),
      city: city.trim(),
    });
    res.redirect("/students");
  } catch (err) {
    console.error(err);
    res.render("add-student", { error: "Something went wrong" });
  }
};

// GET /students/delete/:id
const deleteStudent = async (req, res) => {
  try {
    await Student.destroy({ where: { id: req.params.id } });
    res.redirect("/students");
  } catch (err) {
    console.error(err);
    res.redirect("/students");
  }
};

module.exports = {
  getAllStudents,
  getAddStudent,
  postAddStudent,
  deleteStudent,
};
