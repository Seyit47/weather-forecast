export interface IApiGeoCodeItem {
    "admin1": string;
    "admin1_id": number;
    "admin3": string;
    "admin3_id": number;
    "admin4": string;
    "admin4_id": number;
    "country": string;
    "country_code": string;
    "country_id": number;
    "elevation": number;
    "feature_code": string;
    "id": number;
    "latitude": number;
    "longitude": number;
    "name": string;
    "population": number;
    "postcodes": string[];
    "timezone": string;
}

export interface IApiForecastResponse {
    "latitude": number;
    "longitude": number;
    "generationtime_ms": number;
    "utc_offset_seconds": number;
    "timezone": string;
    "timezone_abbreviation": string;
    "elevation": number;
    "current_units": {
        "time": string;
        "interval": string;
        "temperature_2m": string;
        "is_day": string;
        "weather_code": string;
    };
    "current": {
        "time": string;
        "interval": number;
        "temperature_2m": number;
        "is_day": 1 | 0;
        "weather_code": number;
    };
    "daily_units": {
        "time": string;
        "weather_code": string;
        "temperature_2m_max": string;
        "temperature_2m_min": string;
    };
    "daily": {
        "time": string[];
        "weather_code": number[];
        "temperature_2m_max": number[];
        "temperature_2m_min": number[];
    };
}

export interface IApiCurrentForecast {
    "time": string;
    "interval": number;
    "temperature_2m": number;
    "is_day": 1 | 0;
    "weather_code": number;
}

export interface IApiDailyForecast {
    "time": string;
    "weather_code": number;
    "max_temp": number;
    "min_temp": number;
}

export interface IApiWeatherForecast {
    "daily": IApiDailyForecast[];
    "current": IApiCurrentForecast | null;
}
