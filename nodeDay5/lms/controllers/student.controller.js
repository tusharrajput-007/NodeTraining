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

    // Check duplicate roll number
    const existing = await Student.findOne({ where: { roll_no } });
    if (existing) {
      return res.render("add-student", { error: "Roll number already exists" });
    }

    await Student.create({ name, roll_no, phone, country, state, city });
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
