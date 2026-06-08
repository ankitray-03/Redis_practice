import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notifications", async (req, res) => {
  const payload = {
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  await publisher.publish("notifications", JSON.stringify(payload));

  return res.json({ message: "Published the notification" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
