import jwt from "jsonwebtoken";
import User, { UserType } from "../../models/user";
import Wager from "../../models/wager";
import { Request, Response } from "express";

const wager = async (req: Request, res: Response) => {

	console.log("Wager Request", req.body);
	const { userId, predictionIsHeads, wagerAmount } = req.body;

	const updateStreak = async (existingUser: UserType, streakLength: number) => {
		await User.findByIdAndUpdate(
			existingUser._id,
			{ bonusStreak: streakLength },
			{ new: true }
		);
	};

	const updateUserTokenBalance = async (existingUser: UserType, newBalance: number) => {
		await User.findByIdAndUpdate(
			existingUser._id,
			{ tokens: newBalance },
			{ new: true }
		);
	};
	const updateUserTokenBalanceAndStreak = async (
		existingUser: UserType,
		newBalance: number,
		newStreak: number
	) => {
		await User.findByIdAndUpdate(
			existingUser._id,
			{ $set: { tokens: newBalance, bonusStreak: newStreak } },
			{ new: true }
		);
	};
	const saveNewWager = async (
		existingUser: UserType,
		wagerAmount: number,
		flipWasHeads: boolean,
		payoutAmount: number
	) => {
		const newWager = new Wager({
			user: existingUser._id,
			email: existingUser.email,
			amount: wagerAmount,
			flipWasHeads: flipWasHeads,
			payoutAmount: payoutAmount,
		});
		try {
			await newWager.save();
		} catch (error) {
			res.status(500).json({ message: error });
		}
	};

	try {
		if (!req.body.userId) {
			return res.status(401).json({ message: "Unauthenticated" });
		}

		const existingUser = await User.findOne({ _id: userId }) as UserType;

		if (!existingUser) {
			return res.status(404).json({ message: "User Does Not Exist" });
		}

		if (wagerAmount > existingUser.tokens) {
			return res
				.status(400)
				.json({ message: "Wager Amount Exceeds User Balance" });
		}

		if (wagerAmount <= 0) {
			return res
				.status(400)
				.json({ message: "Wager Amount Must Be Greater Than 0" });
		}

		//Deduct Wager Amount from User Balance
		const newBalance = existingUser.tokens - wagerAmount;
		await updateUserTokenBalance(existingUser, newBalance);

		//Flip Coin
		const isHeads = Math.random() < 0.5; // 50/50 chance
		const wagerWon = isHeads === predictionIsHeads;
		const standardWagerPayout = wagerWon ? wagerAmount * 2 : 0;
		let bonusPayout = 0;
		let newStreak = 0;

		if (wagerWon) {
			//Update Streak
			newStreak = existingUser.bonusStreak + 1;
			//Check for Bonus
			if (newStreak === 3) {
				bonusPayout = wagerAmount * 3;
			} else if (newStreak === 5) {
				bonusPayout = wagerAmount * 10;
				//Reset Streak to 0 after 5 wins
				newStreak = 0;
			}
		}

		//Add Payout to User Balance
		const finalPayout = bonusPayout > 0 ? bonusPayout : standardWagerPayout;

		if (finalPayout > 0) {
			await updateUserTokenBalanceAndStreak(
				existingUser,
				newBalance + finalPayout,
				newStreak
			);
		} else {
			await updateStreak(existingUser, newStreak);
		}

		//Save Wager
		await saveNewWager(existingUser, wagerAmount, isHeads, finalPayout);

		const token = jwt.sign(
			{
				_id: existingUser._id,
				resultIsHeads: isHeads,
				wagerPayout: finalPayout,
				newBalance: newBalance + finalPayout,
			},
			"coin_flip",
			{ expiresIn: "1h" }
		);

		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export default wager;
