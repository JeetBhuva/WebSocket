const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/userAuth");
const { addMessage, getAllMessage } = require("../controllers/messages");

router.post("/addMessage", verifyToken, addMessage);
router.post("/getAllMessage", verifyToken, getAllMessage);

module.exports = router;
