// reads in .env file and makes those values available as environment variables
require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const PostModel = require("./models/postModel");

const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri);
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo');
});

const app = express();

// To parse incoming requests with JSON payloads
app.use(express.json());

// In production, serve frontend from dist folder
app.use(express.static(path.resolve(__dirname, "..") + "/frontend/dist"));

app.get("/api/test", (req, res) => {
  // 200: OK
  res.status(200).json({message: "Hello from backend"});
});

app.get("/api/latest", async (req, res) => {
  console.log("latest");
  const results = await PostModel.find().sort({createdDate: -1});
  console.dir(results);
  res.status(200).json(results);
});

app.post("/api/post", async (req, res) => {
  const {title, text} = req.body;
  await PostModel.create({title, text, createdDate: new Date()});
  res.status(200).json({message: "new post created"});
});

app.use((req, res) => {
  // 404: Not found
  res.status(404).send("<h1>Page not found</h1>");
});

app.use((err, req, res) => {
  // 500: Internal server error
  res.status(500).send("<h1>Something went wrong</h1>");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
