import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379/");

const PORT = process.env.PORT || 3000;

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();

  res.json({ redis: reply }).status(201);
});

app.get("/mongo", async (req, res) => {
  const url =
    process.env.MONGO_URL || "mongodb://localhost:27017/chai_aur_redis";

  if (mongoose.connection.readyState == 0) await mongoose.connect(url);

  res.json({ mongo: "conencted", database: mongoose.connection.name });
});

app.get("/test", async (req, res) => {
  res.send("Server running smoothly").json(201);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
