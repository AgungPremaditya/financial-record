import express, { Application } from "express";
import cors from "cors";
import route from "./routes";

require("dotenv").config();

const app: Application = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", route);

app.listen(port, () => {
  console.log(`Server Runing on Port ${port}`);
});
