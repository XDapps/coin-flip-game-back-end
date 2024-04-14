import helmet from 'helmet';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/userRoutes';

//************ Config ****************/
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) throw new Error("MongoDB URL is not defined");


//************ Middleware ****************/
app.use(helmet());
app.use(express.json());
app.use(cors());

//************ Routes *******************/
app.use("/api/user", userRoutes);

//********** Catch All Route ************/
app.all('*', (_req: Request, res: Response) => {
	res.status(404).send('Route not found.');
});

//************ Error Handling ************/
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
	console.error("Error: ", err.message);
	err.message === "Validation failed" ? res.status(400).send(`${err.message} Validation failed.`) :
		res.status(500).send(`Something went wrong: ${err.message}`);
});


mongoose
	.connect(MONGODB_URL)
	.then(() =>
		app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
	)
	.catch((error) => console.log(error.message));
