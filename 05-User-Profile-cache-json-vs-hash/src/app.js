import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const redis = new Redis(process.env.PORT || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  await redis.set(`user:${id}:json`, JSON.stringify(data));

  return res.json({ success: true, message: "Data stored as string" });
});

app.get("/user/:id/json", async (req, res) => {
  const id = req.params.id;

  const data = await redis.get(`user:${id}:json`);

  return res.json({ success: true, data: JSON.parse(data) });
});

app.post("/user/:id/hash", async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  await redis.hset(`user:${id}:hash`, data);

  return res.json({ success: true, message: "Data stored as Object" });
});

app.get("/user/:id/hash", async (req, res) => {
  const id = req.params.id;

  const data = await redis.hgetall(`user:${id}:hash`);

  return res.json({ success: true, data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
