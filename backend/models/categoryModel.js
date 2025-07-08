import { Schema, model } from "mongoose";

const categorySchema = new Schema(
	{
		name: { type: String, required: true },
		status: { type: String, required: true, default: "active" },
		image: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

categorySchema.index({
    name: "text",
})

const Category = model("categories", categorySchema);
export default Category;
