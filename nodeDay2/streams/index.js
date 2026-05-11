const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/employees" && req.method === "GET") {
    const filePath = path.join(__dirname, "employees.csv");
    const readStream = fs.createReadStream(filePath, "utf-8");

    let rawData = "";

    readStream.on("data", (chunk) => {
      rawData += chunk;
    });

    readStream.on("end", () => {
      //   const lines = rawData.split("\n");
      const lines = rawData.split("\n").map((line) => line.trim());
      const header = lines[0];
      const headers = header.split(",");
      const salaryIndex = headers.indexOf("SALARY");

      const filtered = lines.slice(1).filter((line) => {
        const columns = line.split(",");
        return parseFloat(columns[salaryIndex]) > 10000;
      });

      const result = [header, ...filtered].join("\n");

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(result);
    });

    readStream.on("error", (err) => {
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
