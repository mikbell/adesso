import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
