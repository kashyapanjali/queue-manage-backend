const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const queueRoute = require("./routes/queueRoute");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());

connectDB();

//for test
// app.get("/", (req, res) => {
//     console.log("Hello World");
//     res.send("Hello World");
// });

// Routes
app.use("/api/auth", authRoute);
app.use("/api/queues", queueRoute);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});