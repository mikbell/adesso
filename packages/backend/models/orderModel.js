import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		orderId: { type: String, required: true, unique: true },
		customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		customerName: { type: String, required: true },
		products: [
			{
				productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				name: String,
				quantity: Number,
				price: Number,
			},
		],
		totalAmount: { type: Number, required: true },
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Order", orderSchema);
