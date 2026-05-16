const http = require("http");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const server = http.createServer((req, res) => {
  if (req.url === "/employees" && req.method === "GET") {
    const filePath = path.join(__dirname, "employees.csv");

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    let isFirstLine = true;
    let headers = [];
    let salaryIndex = -1;

    res.writeHead(200, { "Content-Type": "text/plain" });

    rl.on("line", (line) => {
      line = line.trim();
      if (!line) return;

      if (isFirstLine) {
        headers = line.split(",");
        salaryIndex = headers.indexOf("SALARY");
        res.write(line + "\n"); // writing header directly to response
        isFirstLine = false;
        return;
      }

      const columns = line.split(",");
      if (parseFloat(columns[salaryIndex]) > 10000) {
        res.write(line + "\n"); // writing filtered line directly to response
      }
    });

    rl.on("close", () => {
      res.end();
    });

    rl.on("error", (err) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "Error reading file", error: err.message }),
      );
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
