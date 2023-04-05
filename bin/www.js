#!/usr/bin/env node

/**
 * Module dependencies.
 */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

var app = require("../app");
var debug = require("debug")("server:server");
var http = require("http");

const mongoose = require("mongoose");
const DB = process.env.DATABASE;
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/BuzzChat")
  .then(() => console.log("DB is connected..."))
  .catch((error) => console.log(error));
// mongoose
//   .connect(DB)
//   .then(() => console.log("DB is connected..."))
//   .catch((error) => console.log(error));

const socket = require("socket.io");
const { path } = require("../app");

/**
 * Get port from environment and store in Express.
 */
  
var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`server is running on port ${port}`));
server.on("error", onError);
server.on("listening", onListening);

// socket.io
const io = socket(server, {
  cors: {
    origin: [
      "https://cheery-entremet-1951d4.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-recieve", data.message);
    }
  });

  socket.on("disconnect", (reason) => {
    onlineUsers.forEach((value, index) => {
      // Delete item by its value
      if (value === socket.id) {
        onlineUsers.delete(index);
      }
    });
  });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
