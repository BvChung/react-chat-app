const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3001;
const cors = require("cors");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

connectDB();

// nodemon server to observe changes
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);

// When front end reaches /api/chatlogs app looks into route folder to establish route
app.use("/api/v1/chatlogs", require("./routes/chatlogRoutes"));

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

// import chatlogs from "./api/chatlogs.route.js";
// app.use("/api/v1/chatlogs", chatlogs);
// app.use("*", (req, res) => {
// 	res.status(404).json({ error: "not found" });
// });
