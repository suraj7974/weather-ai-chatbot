// Location controller

import type { Request, Response, NextFunction } from 'express';
import { searchCities, reverseGeocode } from '../services/geocoding.service.js';

/**
 * Search cities by name
 */
export const searchLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      res.status(400).json({ error: 'q (search query) parameter is required' });
      return;
    }

    const locations = await searchCities(
      q as string,
      limit ? parseInt(limit as string) : 5
    );

    res.json(locations);
  } catch (error) {
    next(error);
  }
};

/**
 * Reverse geocode coordinates to location
 */
export const reverseLocation = async (
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

    const location = await reverseGeocode(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
};
