// Utility script to generate bcrypt hashed password
// Usage: node scripts/hashPassword.js yourpassword
// Copy the output hash and insert it into the database

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log(
    "Please provide a password: node scripts/hashPassword.js yourpassword",
  );
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
