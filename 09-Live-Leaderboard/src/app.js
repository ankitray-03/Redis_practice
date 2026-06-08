import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// increment the score count of a particular user by +1
app.post("/post/:id/score", async (req, res) => {
  const userId = req.params.id;

  const score = await redis.zincrby("leaderboard", 1, genrateUserKey(userId));

  return res.json({ success: true, score: score });
});

// adds a particular score to id
app.post("/leaderboard/score", async (req, res) => {
  const { id, score } = req.body;

  const newScore = await redis.zincrby(
    "leaderboard",
    score,
    genrateUserKey(id),
  );

  return res.json({ success: true, score: newScore });
});

// get top 10 performers details
app.get("/leaderboard", async (req, res) => {
  const topPerformers = await redis.zrevrange("leaderboard", 0, 9);

  return res.json({ "Top 10 performers": topPerformers });
});

// get rank of a particular user
app.get("/leaderboard/:userId/rank", async (req, res) => {
  const id = req.params.userId;

  const rank = await redis.zrevrank("leaderboard", genrateUserKey(id));

  return res.json({ rank });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function genrateUserKey(id) {
  return `user:${id}`;
}
