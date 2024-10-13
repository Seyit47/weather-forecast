import { useWeatherForecastQueryParams } from "./useWeatherForecastQueryParams";

export function useFetchWeatherForecast() {
    const { $http } = useNuxtApp();

    const { latitude, longitude } = useWeatherForecastQueryParams();

    const result: IApiWeatherForecast = reactive({
        current: null,
        daily: [],
    });

    async function fetchWeatherForecast() {
        const { data } = await useAsyncData(
            "weather",
            async () => {
                if (!latitude.value || !longitude.value) {
                    return result;
                }

                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                const query: Record<string, any> = {
                    "latitude": latitude.value || undefined,
                    "longitude": longitude.value || undefined,
                    "timezone": timezone || undefined,
                    "current": "temperature_2m,is_day,weather_code",
                    "daily": "weather_code,temperature_2m_max,temperature_2m_min",
                };

                const response = await $http.api.get<IApiForecastResponse>(`v1/forecast`, query, {
                    abortPrevious: true,
                });

                if (response.data !== undefined) {
                    result.daily = [];
                    for (let i = 0; i < response.data.daily.time.length; i++) {
                        result.daily.push({
                            "time": response.data.daily.time[i],
                            "weather_code": response.data.daily.weather_code[i],
                            "max_temp": response.data.daily.temperature_2m_max[i],
                            "min_temp": response.data.daily.temperature_2m_min[i],
                        });
                    }

                    result.current = response.data.current;
                }

                return result;
            },
            {
                watch: [latitude, longitude],
                default: () => reactive(result),
                deep: true,
            }
        );

        return {
            data,
        };
    }

    return {
        latitude,
        longitude,
        fetchWeatherForecast,
    };
}
