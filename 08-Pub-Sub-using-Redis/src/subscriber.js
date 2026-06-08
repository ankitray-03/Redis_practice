import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.log("Error occured while subscribing !!");
    return;
  }

  console.log("Subcribed successfull to notifications channel");
});

subscriber.on("message", (channel, message) => {
  console.log(`Recieved on ${channel} : `, JSON.parse(message));
});
