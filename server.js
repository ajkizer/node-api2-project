const express = require("express");
const BlogRouter = require("./Router/db-router.js");

const server = express();

server.use(express.json());
server.use("/api/posts", BlogRouter);

server.get("/", (req, res) => {
  res.send("it's working!");
});

module.exports = server;
