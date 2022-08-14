require("dotenv").config();
import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server started at http://localhost:${port}`);
});
