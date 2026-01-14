// Location routes - TODO: Implement
import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/search', (req, res) => {
  res.json({ message: 'Location search - TODO' });
});

router.get('/reverse', (req, res) => {
  res.json({ message: 'Reverse geocode - TODO' });
});

export default router;
