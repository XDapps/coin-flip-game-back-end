import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../../models/user";

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			return res.status(404).json({ message: "User Does Not Exist" });
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid Password" });
		}

		const token = jwt.sign(
			{
				_id: existingUser._id,
				name: existingUser.name,
				email: existingUser.email,
				password: existingUser.password,
				tokens: existingUser.tokens,
			},
			"coin_flip",
			{ expiresIn: "1h" }
		);

		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export default login;