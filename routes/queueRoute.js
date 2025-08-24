const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

// Create a new queue
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

// Get all queues
router.get("/", async (req, res) => {
  try {
    const queues = await Queue.find();
    res.json(queues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tokens of a queue
router.get("/:id/tokens", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    res.json(queue.tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add token
router.post("/:id/tokens", async (req, res) => {
  try {
    const { personName } = req.body;
    const queue = await Queue.findById(req.params.id);

    const tokenNumber = queue.tokens.length + 1;
    queue.tokens.push({ tokenNumber, personName, status: "waiting" });
    await queue.save();

    res.json(queue.tokens); // <-- return tokens only
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Move token
router.put("/:id/tokens/:tokenId/move", async (req, res) => {
  try {
    const { direction } = req.body;
    const queue = await Queue.findById(req.params.id);

    const index = queue.tokens.findIndex(t => t._id.toString() === req.params.tokenId);
    if (index === -1) return res.status(404).json({ msg: "Token not found" });

    if (direction === "up" && index > 0) {
      [queue.tokens[index], queue.tokens[index - 1]] = [queue.tokens[index - 1], queue.tokens[index]];
    } else if (direction === "down" && index < queue.tokens.length - 1) {
      [queue.tokens[index], queue.tokens[index + 1]] = [queue.tokens[index + 1], queue.tokens[index]];
    }

    // 🔥 Reassign token numbers in new order
    queue.tokens.forEach((t, i) => {
      t.tokenNumber = i + 1;
    });

    await queue.save();
    res.json(queue.tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Assign top token
router.put("/:id/assign", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue.tokens.length) return res.status(400).json({ msg: "Queue is empty" });

    queue.tokens[0].status = "serving";
    await queue.save();

    res.json(queue.tokens); // return tokens only
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel token
router.delete("/:id/tokens/:tokenId", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    queue.tokens = queue.tokens.filter(t => t._id.toString() !== req.params.tokenId);

    // Reassign token numbers
    queue.tokens.forEach((t, i) => {
      t.tokenNumber = i + 1;
    });

    await queue.save();
    res.json(queue.tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
