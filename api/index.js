import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Transaction from "./models/Transaction.model.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = 5000;

const __dirname = path.resolve()

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"/client/dist")))
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"client","dist","index.html"))
})
app.get("/", (req, res) => {
  res.json("testing");
});
app.post("/api/transaction", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const { name, price,description, Date } = req.body;

    const newTransaction = await Transaction.create({
      name,
      price,
      description,
      Date,
    });

    newTransaction.save();
    res.json(newTransaction);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/api/transactions",async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL);
    const transactions =await Transaction.find()

    res.json(transactions)
})

app.listen(port, (req, res) => {
  console.log(`Server is on ${port}`);
});
