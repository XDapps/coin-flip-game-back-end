import jwt from "jsonwebtoken";
import User from "../../models/user";
import { Request, Response } from "express";

const userTokenBalance = async (req: Request, res: Response) => {
	const { userId } = req.body;
	if (!req.body.userId) {
		return res.status(401).json({ message: "Unauthenticated" });
	}

	try {
		const existingUser = await User.findOne({ _id: userId });

		if (!existingUser) {
			return res.status(404).json({ message: "User Does Not Exist" });
		}

		const token = jwt.sign(
			{
				_id: existingUser._id,
				tokenBalance: existingUser.tokens,
			},
			"coin_flip",
			{ expiresIn: "1h" }
		);
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export default userTokenBalance;
