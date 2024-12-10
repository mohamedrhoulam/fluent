import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/tasks", taskRoutes);

mongoose
  .connect("mongodb://localhost:27017/fluent", { // running on the port instead ??

  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
