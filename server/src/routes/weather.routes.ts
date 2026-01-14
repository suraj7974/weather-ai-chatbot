// Weather routes
import { Router, type Router as RouterType } from 'express';
import { getWeather, getWeatherCity, getWeatherForecast } from '../controllers/weather.controller.js';

const router: RouterType = Router();

router.get('/', getWeather);
router.get('/city', getWeatherCity);
router.get('/forecast', getWeatherForecast);

export default router;
