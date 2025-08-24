const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  tokenNumber: Number,
  personName: String,
  status: { type: String, default: "waiting" },
  createdAt: { type: Date, default: Date.now }
});

const queueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tokens: [tokenSchema]
});

//exports the schema
module.exports = mongoose.model("Queue", queueSchema);

