const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/userAuth");
const {
  userRegistration,
  userLogin,
  getAllUsers,
  updateOnlineStatus,
} = require("../controllers/user");

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.get("/getAllUsers/:id", verifyToken, getAllUsers);
router.put("/updateUserOnlineStatus/:id", verifyToken, updateOnlineStatus);

module.exports = router;
