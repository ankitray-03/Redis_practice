import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379/");

app.post("/getOtp", async (req, res) => {
  const { phone } = req.body;

  const otp = generateOtp().toString();

  await redis.set(generateOtpKey(phone), otp, "EX", 60);

  return res.json({ success: true, message: `OTP is ${otp}` });
});

app.post("/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = await redis.get(generateOtpKey(phone));

  if (!storedOtp)
    return res.json({ success: false, message: "OTP not found or expired" });

  if (storedOtp !== otp)
    return res.json({ success: false, message: "OTP mismatch" });

  // verify the user here

  await redis.del(generateOtpKey(phone));

  return res.json({ success: true, message: "OTP verification successfull" });
});

app.get("/otp/ttl/:phone", async (req, res) => {
  const phone = req.params.phone;

  const timeLeft = await redis.ttl(generateOtpKey(phone));

  return res.json({ ttl: timeLeft });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

function generateOtpKey(phone) {
  return `otp:${phone}`;
}

function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);

  return otp;
}
