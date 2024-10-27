const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const event = new Event({
      user: req.user.id,
      title,
      description,
      date,
    });
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error creating events" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching events" });
  }
};
