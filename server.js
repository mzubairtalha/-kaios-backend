import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./notifications.json";

// ensure file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// add notification (backend/admin use)
app.post("/add-notification", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  
  data.push({
    id: Date.now(),
    message: req.body.message,
    sent: false
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(data));

  res.json({ success: true });
});

// check notification (KaiOS app will call this)
app.get("/get-notification", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));

  const notif = data.find(n => n.sent === false);

  if (notif) {
    notif.sent = true;
    fs.writeFileSync(DB_FILE, JSON.stringify(data));

    res.json({
      newNotification: true,
      message: notif.message
    });
  } else {
    res.json({
      newNotification: false
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
