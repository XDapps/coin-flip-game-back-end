// userRoutes.ts
import express from 'express';
import auth from '../middleware/auth';
import login from '../controllers/user/login';
import changePassword from '../controllers/user/change-password';
import signup from '../controllers/user/signup';
import userTokenBalance from '../controllers/user/token-balance';
import wagerHistory from '../controllers/user/wager-history';
import wager from '../controllers/user/wager';

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/wager", auth, wager);
router.post("/wager-history", auth, wagerHistory);
router.post("/token-balance", auth, userTokenBalance);
router.post("/changePassword", auth, changePassword);

export default router;
