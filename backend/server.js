import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import authRouter from "./routes/authRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
