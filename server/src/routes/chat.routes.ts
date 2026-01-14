// Chat routes
import { Router, type Router as RouterType } from 'express';
import { handleChat } from '../controllers/chat.controller.js';

const router: RouterType = Router();

router.post('/', handleChat);

export default router;
