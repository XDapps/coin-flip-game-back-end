import mongoose from "mongoose";

const wagerSchema = new mongoose.Schema({
	user: { type: String, required: true },
	email: { type: String, required: true },
	amount: { type: Number, required: true },
	flipWasHeads: { type: Boolean, required: true },
	payoutAmount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Wager", wagerSchema);

export type WagerType = {
	user: string;
	email: string;
	amount: number;
	flipWasHeads: boolean;
	payoutAmount: number;
};