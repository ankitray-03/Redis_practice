import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

// saving jobs to lists
app.post("/emails", async (req, res) => {
  const Job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.body || "No contecnt",
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(Job));

  return res.json({ success: true, Job });
});

app.get("/emails/process-one", async (req, res) => {
  const Job = await redis.rpop(QUEUE_KEY);

  return res.json({ success: true, Job: JSON.parse(Job) });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
