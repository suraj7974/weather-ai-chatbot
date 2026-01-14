// Chat routes - TODO: Implement
import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.post('/', (req, res) => {
  res.json({ response: 'Chat endpoint - TODO' });
});

export default router;
