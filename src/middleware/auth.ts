import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserType } from '../models/user';

const auth = async (req: Request, res: Response, next: NextFunction) => {

	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) throw new Error('No token provided');

		const isCustomAuth = token.length < 500;
		let decodedData;

		if (isCustomAuth) {
			decodedData = jwt.verify(token, "coin_flip") as UserType;
			req.body.userId = decodedData?._id;
		} else {
			decodedData = jwt.decode(token);
			req.body.userId = decodedData?.sub;
		}

		next();
	} catch (error) {
		res.status(401).json({ message: 'Unauthorized' });
	}
};

export default auth;
