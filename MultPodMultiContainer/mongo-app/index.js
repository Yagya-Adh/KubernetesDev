const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || "27017";

// Connect to MongoDB
mongoose
  .connect(`mongodb://${mongoHost}:${mongoPort}/yourDatabaseName`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process on connection failure
  });

// Define a Mongoose schema and model
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
});
const Email = mongoose.model("Email", emailSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/add-email", async (req, res) => {
  const { email } = req.body;
  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error adding email:", error);
    res.status(500).send("Error adding email");
  }
});

app.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find({});
    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Error fetching emails");
  }
});

// Graceful shutdown
app.get("/exit", (req, res) => {
  // Perform cleanup actions if needed before shutting down
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    res.send("Server stopped");
    process.exit(0); // Exit the Node.js process
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
