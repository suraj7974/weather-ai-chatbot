// Weather routes - TODO: Implement
import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Weather endpoint - TODO' });
});

router.get('/city', (req, res) => {
  res.json({ message: 'Weather by city - TODO' });
});

router.get('/forecast', (req, res) => {
  res.json({ message: 'Forecast endpoint - TODO' });
});

export default router;
