import express from "express";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.post("/welcome-email", async (req, res) => {
  const Job = await emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      subject: req.body.subject || "No subject",
      content: req.body.body || "No content",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );

  return res.json({ Job });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
