// Weather service - OpenWeatherMap integration

import axios from 'axios';
import { config } from '../config/env.js';
import type { 
  WeatherData, 
  ForecastData, 
  ForecastItem,
  OWMWeatherResponse, 
  OWMForecastResponse 
} from '../types/index.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather by coordinates
 */
export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await axios.get<OWMWeatherResponse>(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: config.OPENWEATHER_API_KEY,
      units: 'metric',
    },
  });

  return parseWeatherResponse(response.data);
};

/**
 * Get current weather by city name
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const response = await axios.get<OWMWeatherResponse>(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: config.OPENWEATHER_API_KEY,
      units: 'metric',
    },
  });

  return parseWeatherResponse(response.data);
};

/**
 * Get 5-day forecast by coordinates
 */
export const getForecast = async (lat: number, lon: number): Promise<ForecastData> => {
  const response = await axios.get<OWMForecastResponse>(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: config.OPENWEATHER_API_KEY,
      units: 'metric',
    },
  });

  return parseForecastResponse(response.data);
};

/**
 * Parse OpenWeatherMap weather response to our format
 */
const parseWeatherResponse = (data: OWMWeatherResponse): WeatherData => {
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: data.weather[0].description,
    conditionCode: data.weather[0].id,
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  };
};

/**
 * Parse OpenWeatherMap forecast response to our format
 * Returns one forecast per day (at noon)
 */
const parseForecastResponse = (data: OWMForecastResponse): ForecastData => {
  const dailyForecasts: Map<string, ForecastItem> = new Map();

  for (const item of data.list) {
    const date = item.dt_txt.split(' ')[0];
    
    // Take the midday forecast (12:00) for each day, or first available
    if (!dailyForecasts.has(date) || item.dt_txt.includes('12:00')) {
      dailyForecasts.set(date, {
        date: item.dt_txt,
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        condition: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    }
  }

  return {
    city: data.city.name,
    items: Array.from(dailyForecasts.values()).slice(0, 5),
  };
};
