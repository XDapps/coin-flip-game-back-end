

export default class UserService {
	static async findUserById(userId: string) {
		return { _id: userId, name: 'Test User' };
	}
}