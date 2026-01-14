// Geocoding service - City lookup using OpenWeatherMap

import axios from 'axios';
import { config } from '../config/env.js';
import type { LocationData, OWMGeoResponse } from '../types/index.js';

const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Search cities by name
 */
export const searchCities = async (query: string, limit: number = 5): Promise<LocationData[]> => {
  const response = await axios.get<OWMGeoResponse[]>(`${GEO_URL}/direct`, {
    params: {
      q: query,
      limit,
      appid: config.OPENWEATHER_API_KEY,
    },
  });

  return response.data.map(parseGeoResponse);
};

/**
 * Reverse geocode coordinates to location
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<LocationData | null> => {
  const response = await axios.get<OWMGeoResponse[]>(`${GEO_URL}/reverse`, {
    params: {
      lat,
      lon,
      limit: 1,
      appid: config.OPENWEATHER_API_KEY,
    },
  });

  if (response.data.length === 0) {
    return null;
  }

  return parseGeoResponse(response.data[0]);
};

/**
 * Parse OpenWeatherMap geo response to our format
 */
const parseGeoResponse = (data: OWMGeoResponse): LocationData => {
  return {
    name: data.name,
    country: data.country,
    state: data.state,
    lat: data.lat,
    lon: data.lon,
  };
};
