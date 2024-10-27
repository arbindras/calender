const express = require("express");
const { createEvent, getEvents } = require("../controllers/eventController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/events", auth, createEvent);
router.get("/events", auth, getEvents);

module.exports = router;
