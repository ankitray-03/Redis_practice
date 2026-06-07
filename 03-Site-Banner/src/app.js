import express, { response } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379/");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  await redis.set(
    BANNER_KEY,
    req.body.message || "Welcome to Redis banner tutorial",
  );

  res.json({ success: true });
});

app.get("/banner", async (req, res) => {
  const data = await redis.get(BANNER_KEY);

  res.json({ success: true, banner: data });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);

  res.json({ success: true, message: "Banner deleted successfully" });
});

app.get("/banner/exists", async (req, res) => {
  const response = await redis.exists(BANNER_KEY);

  return res.json({ Exists: Boolean(response) });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
