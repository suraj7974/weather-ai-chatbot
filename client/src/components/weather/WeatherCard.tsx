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

  // Get refined gradient based on weather condition and temperature
  const getWeatherStyle = () => {
    const code = weather.conditionCode;
    const temp = weather.temp;
    
    // Thunderstorm (200-299)
    if (code >= 200 && code < 300) {
      return {
        gradient: 'from-slate-700 to-slate-900',
        textColor: 'text-white',
        subTextColor: 'text-slate-300',
      };
    }
    
    // Drizzle/Rain (300-599)
    if (code >= 300 && code < 600) {
      return {
        gradient: 'from-slate-500 to-slate-700',
        textColor: 'text-white',
        subTextColor: 'text-slate-200',
      };
    }
    
    // Snow (600-699)
    if (code >= 600 && code < 700) {
      return {
        gradient: 'from-slate-200 to-slate-400',
        textColor: 'text-slate-800',
        subTextColor: 'text-slate-600',
      };
    }
    
    // Fog/Mist (700-799)
    if (code >= 700 && code < 800) {
      return {
        gradient: 'from-zinc-400 to-zinc-500',
        textColor: 'text-white',
        subTextColor: 'text-zinc-200',
      };
    }
    
    // Clear (800)
    if (code === 800) {
      // Temperature-based gradient for clear sky
      if (temp >= 30) {
        return {
          gradient: 'from-amber-500 to-orange-600',
          textColor: 'text-white',
          subTextColor: 'text-amber-100',
        };
      } else if (temp >= 20) {
        return {
          gradient: 'from-sky-400 to-blue-500',
          textColor: 'text-white',
          subTextColor: 'text-sky-100',
        };
      } else if (temp >= 10) {
        return {
          gradient: 'from-cyan-500 to-blue-600',
          textColor: 'text-white',
          subTextColor: 'text-cyan-100',
        };
      } else {
        return {
          gradient: 'from-blue-600 to-indigo-700',
          textColor: 'text-white',
          subTextColor: 'text-blue-200',
        };
      }
    }
    
    // Clouds (801-899)
    return {
      gradient: 'from-zinc-500 to-zinc-600',
      textColor: 'text-white',
      subTextColor: 'text-zinc-200',
    };
  };

  const style = getWeatherStyle();

  return (
    <div 
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${style.gradient}
        rounded-xl p-5 ${style.textColor}
        animate-fadeIn
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{weather.city}</h3>
          <p className={`text-sm ${style.subTextColor}`}>{weather.country}</p>
        </div>
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.condition}
          className="w-16 h-16 -mt-2 -mr-2"
        />
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <span className="text-5xl font-light">{Math.round(weather.temp)}</span>
        <span className="text-2xl font-light">°C</span>
        <p className={`text-sm ${style.subTextColor} capitalize mt-1`}>
          {weather.condition}
        </p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className={`flex items-center gap-2 ${style.subTextColor}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>{weather.humidity}%</span>
        </div>
        <div className={`flex items-center gap-2 ${style.subTextColor}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
