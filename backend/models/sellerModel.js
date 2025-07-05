import { Schema, model } from "mongoose";

const sellerSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
        role: { type: String, required: true, default: "seller" },
        status: { type: String, required: true, default: "pending" },
		payment: { type: String, required: true, default: "inactive" },
		method: { type: String, required: true },
		image: { type: String, default: "" },
		shopInfo: { type: Object, required: true, default: {} },
	},
	{ timestamps: true }
);

const Seller = model("sellers", sellerSchema);
export default Seller;
