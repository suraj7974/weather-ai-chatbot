// Weather controller

import type { Request, Response, NextFunction } from 'express';
import { getWeatherByCoords, getWeatherByCity, getForecast } from '../services/weather.service.js';

/**
 * Get current weather by coordinates
 */
export const getWeather = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'lat and lon query parameters are required' });
      return;
    }

    const weather = await getWeatherByCoords(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    res.json(weather);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current weather by city name
 */
export const getWeatherCity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ error: 'q (city name) query parameter is required' });
      return;
    }

    const weather = await getWeatherByCity(q as string);
    res.json(weather);
  } catch (error) {
    next(error);
  }
};

/**
 * Get 5-day forecast by coordinates
 */
export const getWeatherForecast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'lat and lon query parameters are required' });
      return;
    }

    const forecast = await getForecast(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    res.json(forecast);
  } catch (error) {
    next(error);
  }
};
