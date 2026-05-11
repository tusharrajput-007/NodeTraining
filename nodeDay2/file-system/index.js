const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "employees.csv");
const outputFile = path.join(__dirname, "output.txt");

// const lines = fs.readFileSync(inputFile, "utf-8").split("\n");

// const header = lines[0];
// const filtered = lines.slice(1).filter((line) => {
//   const columns = line.split(",");
//   return columns[5] === "IT_PROG";
// });

// const result = [header, ...filtered].join("\n");

const lines = fs.readFile(inputFile, "utf-8", (err, data) => {
  if (err) {
    console.error("Oops! Something went wrong:", err);
    return;
  }
  const newLines = data.split("\n");

  const header = newLines[0];
  const headers = header.split(",");
  const jobIdIndex = headers.indexOf("JOB_ID");

  const filtered = newLines.slice(1).filter((line) => {
    const columns = line.split(",");
    return columns[jobIdIndex] === "IT_PROG";
  });

  const result = [header, ...filtered].join("\n");

  fs.writeFileSync(outputFile, result, "utf-8");
  console.log("Filtered records written to output.txt");
  console.log(`Total IT_PROG employees found: ${filtered.length}`);
});
