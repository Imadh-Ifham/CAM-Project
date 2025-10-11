import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase Admin FIRST before importing app
import "./config/firebaseAdmin";

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Firebase Admin SDK initialized`);
});
