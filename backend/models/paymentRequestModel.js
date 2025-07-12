import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
	{
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("PaymentRequest", paymentRequestSchema);
