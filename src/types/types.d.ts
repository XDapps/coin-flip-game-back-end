declare global {
	namespace Express {
		interface Request {
			userId?: string; // Adds a userId property which can be a string or undefined
		}
	}
}
