import dotenv from "dotenv";
dotenv.config();
import app from "./app";

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
