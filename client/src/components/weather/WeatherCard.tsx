import type { WeatherData } from '../../types';
import { useLanguage } from '../../context';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useLanguage();

  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // Get refined style based on weather condition and temperature
  const getWeatherStyle = () => {
    const code = weather.conditionCode;
    const temp = weather.temp;
    
    // Thunderstorm (200-299)
    if (code >= 200 && code < 300) {
      return {
        gradient: 'from-neutral-700 to-neutral-900',
        textColor: 'text-white',
        subTextColor: 'text-neutral-300',
      };
    }
    
    // Drizzle/Rain (300-599)
    if (code >= 300 && code < 600) {
      return {
        gradient: 'from-neutral-600 to-neutral-800',
        textColor: 'text-white',
        subTextColor: 'text-neutral-200',
      };
    }
    
    // Snow (600-699)
    if (code >= 600 && code < 700) {
      return {
        gradient: 'from-neutral-200 to-neutral-300',
        textColor: 'text-neutral-900',
        subTextColor: 'text-neutral-600',
      };
    }
    
    // Fog/Mist (700-799)
    if (code >= 700 && code < 800) {
      return {
        gradient: 'from-neutral-400 to-neutral-500',
        textColor: 'text-white',
        subTextColor: 'text-neutral-100',
      };
    }
    
    // Clear (800)
    if (code === 800) {
      // Temperature-based gradient for clear sky
      if (temp >= 30) {
        return {
          gradient: 'from-neutral-800 to-neutral-900',
          textColor: 'text-white',
          subTextColor: 'text-neutral-300',
        };
      } else if (temp >= 20) {
        return {
          gradient: 'from-neutral-700 to-neutral-800',
          textColor: 'text-white',
          subTextColor: 'text-neutral-200',
        };
      } else if (temp >= 10) {
        return {
          gradient: 'from-neutral-600 to-neutral-700',
          textColor: 'text-white',
          subTextColor: 'text-neutral-200',
        };
      } else {
        return {
          gradient: 'from-neutral-500 to-neutral-700',
          textColor: 'text-white',
          subTextColor: 'text-neutral-200',
        };
      }
    }
    
    // Clouds (801-899)
    return {
      gradient: 'from-neutral-500 to-neutral-600',
      textColor: 'text-white',
      subTextColor: 'text-neutral-200',
    };
  };

  const style = getWeatherStyle();

  return (
    <div 
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${style.gradient}
        rounded-lg p-5 ${style.textColor}
        animate-fadeIn
        shadow-sm
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold">{weather.city}</h3>
          <p className={`text-sm ${style.subTextColor}`}>{weather.country}</p>
        </div>
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.condition}
          className="w-14 h-14 -mt-2 -mr-2"
        />
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <span className="text-4xl font-light">{Math.round(weather.temp)}</span>
        <span className="text-xl font-light">°C</span>
        <p className={`text-sm ${style.subTextColor} capitalize mt-1`}>
          {weather.condition}
        </p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className={`flex items-center gap-2 ${style.subTextColor}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>{weather.humidity}%</span>
        </div>
        <div className={`flex items-center gap-2 ${style.subTextColor}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <span>{weather.windSpeed} m/s</span>
        </div>
      </div>

      {/* Feels like */}
      <div className={`mt-3 pt-3 border-t border-white/20 text-sm ${style.subTextColor}`}>
        {t('weather.feelsLike')} {Math.round(weather.feelsLike)}°C
      </div>
    </div>
  );
}
