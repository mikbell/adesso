import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import categoryRouter from "./routes/categoryRouter.js";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

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
app.use("/api", categoryRouter);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
