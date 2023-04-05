const Messages = require("../models/messageSchema");

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const messageData = await Messages.create({
      message: message,
      users: [from, to],
      sender: from,
    });
    console.log(messageData)

    if (messageData) {
      res
        .status(201)
        .send({ message: "Message added successfully", data: messageData });
    } else {
      res
        .status(400)
        .send({ message: "Failed to add message to the database" });
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const getAllMessage = await Messages.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });
    
    const projectMessages = getAllMessage.map((item) => {
      return {
        fromSelf: item.sender.toString() === from, //return true or false
        message: item.message,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    if (getAllMessage) {
      res.status(200).send({
        message: "All messages get successfully",
        data: projectMessages,
      });
    } else {
      res
        .status(400)
        .send({ message: "Failed to get all message from database" });
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = { addMessage, getAllMessage };
