import jwt from "jsonwebtoken";
import User from "../../models/user";
import Wager from "../../models/wager";
import { Request, Response } from "express";

const wagerHistory = async (req: Request, res: Response) => {
	const { userId } = req.body;
	console.log("Wager History Request", req.body);
	if (!req.body.userId) {
		return res.status(401).json({ message: "Unauthenticated" });
	}

	try {
		const existingUser = await User.findOne({ _id: userId });
		
		if (!existingUser) {
			return res.status(404).json({ message: "User Does Not Exist" });
		}
		const recentWagers = await Wager.find({ user: userId })
			.sort({ createdAt: -1 })
			.limit(10);

		const token = jwt.sign(
			{
				_id: existingUser._id,
				recentWagers: recentWagers,
			},
			"coin_flip",
			{ expiresIn: "1h" }
		);
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export default wagerHistory;
