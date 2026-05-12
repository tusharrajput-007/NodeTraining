const http = require("http");
const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");

const server = http.createServer((req, res) => {
  if (req.url === "/employees" && req.method === "GET") {
    const filePath = path.join(__dirname, "employees.csv");
    const readStream = fs.createReadStream(filePath, "utf-8");

    let isFirstLine = true; // to deal with the first header line
    let headers = [];
    let salaryIndex = -1;
    let leftover = ""; // incomplete part from the last of previous chunk

    const filterTransform = new Transform({
      transform(chunk, encoding, callback) {
        const lines = (leftover + chunk.toString()).split("\n");
        leftover = lines.pop(); // last incomplete line saved for next chunk (for next iteration)

        for (let line of lines) {
          line = line.trim();
          if (!line) continue;

          if (isFirstLine) {
            headers = line.split(",");
            salaryIndex = headers.indexOf("SALARY");
            this.push(line + "\n"); // push header to response
            isFirstLine = false;
            continue;
          }

          const columns = line.split(",");
          if (parseFloat(columns[salaryIndex]) > 10000) {
            this.push(line + "\n"); // push filtered line to response
          }
        }
        callback();
      },

      flush(callback) {
        // is called when no more chunks remains
        // process the last remaining line
        if (leftover.trim()) {
          const columns = leftover.trim().split(",");
          if (parseFloat(columns[salaryIndex]) > 10000) {
            this.push(leftover.trim() + "\n");
          }
        }
        callback();
      },
    });

    res.writeHead(200, { "Content-Type": "text/plain" });
    readStream.pipe(filterTransform).pipe(res); // piping the readstream with transform stream

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
