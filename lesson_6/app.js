import express, { json } from "express";
const app = express();
import itemsRouter from "./routes/items.js";

app.use(json());
app.use("/items", itemsRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
