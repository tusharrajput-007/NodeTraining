const http = require("http");

const books = [
  {
    BookId: 1,
    BookName: "Book ABC",
    Author: "ABC",
    Price: 299,
    Pages: 208,
  },
  {
    BookId: 2,
    BookName: "Book DEF",
    Author: "DEF",
    Price: 499,
    Pages: 320,
  },
  {
    BookId: 3,
    BookName: "Book PQR",
    Author: "PQR",
    Price: 599,
    Pages: 431,
  },
  {
    BookId: 4,
    BookName: "Book XYZ",
    Author: "XYZ",
    Price: 399,
    Pages: 278,
  },
];

const server = http.createServer((req, res) => {
  if (req.url === "/books" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(books));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
