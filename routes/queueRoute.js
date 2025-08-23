const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

//Create Queue
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newQueue = new Queue({ name, tokens: [] });
    await newQueue.save();
    res.json(newQueue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get All Queues
router.get("/", async (req, res) => {
  try {
    const queues = await Queue.find();
    res.json(queues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Token to Queue
router.post("/:id/tokens", async (req, res) => {
  try {
    const { personName } = req.body;
    const queue = await Queue.findById(req.params.id);

    const tokenNumber = queue.tokens.length + 1;
    queue.tokens.push({ tokenNumber, personName });
    await queue.save();

    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Move Token Up or Down
router.put("/:id/tokens/:tokenId/move", async (req, res) => {
  try {
    const { direction } = req.body; // "up" or "down"
    const queue = await Queue.findById(req.params.id);

    let index = queue.tokens.findIndex(t => t._id.toString() === req.params.tokenId);
    if (index === -1) return res.status(404).json({ msg: "Token not found" });

    if (direction === "up" && index > 0) {
      [queue.tokens[index], queue.tokens[index - 1]] = [queue.tokens[index - 1], queue.tokens[index]];
    } else if (direction === "down" && index < queue.tokens.length - 1) {
      [queue.tokens[index], queue.tokens[index + 1]] = [queue.tokens[index + 1], queue.tokens[index]];
    }

    await queue.save();
    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Assign Top Token
router.put("/:id/assign", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue.tokens.length) return res.status(400).json({ msg: "Queue is empty" });

    queue.tokens[0].status = "serving";
    await queue.save();

    res.json(queue.tokens[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Cancel Token
router.delete("/:id/tokens/:tokenId", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    queue.tokens = queue.tokens.filter(t => t._id.toString() !== req.params.tokenId);
    await queue.save();

    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
