import { Schema, model } from "mongoose";

const sellerCustomerSchema = new Schema({
	sellerId: { type: String, required: true },
	customers: { type: Array, default: [] },
}, { timestamps: true });

const SellerCustomer = model("seller_customers", sellerCustomerSchema);
export default SellerCustomer;
