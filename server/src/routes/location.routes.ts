// Location routes
import { Router, type Router as RouterType } from 'express';
import { searchLocation, reverseLocation } from '../controllers/location.controller.js';

const router: RouterType = Router();

router.get('/search', searchLocation);
router.get('/reverse', reverseLocation);

export default router;
