// Route aggregator
import { Router, type Router as RouterType } from 'express';
import chatRoutes from './chat.routes.js';
import weatherRoutes from './weather.routes.js';
import locationRoutes from './location.routes.js';

const router: RouterType = Router();

router.use('/chat', chatRoutes);
router.use('/weather', weatherRoutes);
router.use('/location', locationRoutes);

export default router;
