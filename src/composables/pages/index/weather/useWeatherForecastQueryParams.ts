export function useWeatherForecastQueryParams() {
    const latitude = useCommonRouteQuery<string, number | string>("latitude", "", {
        convertTo(value) {
            return `${value}`;
        },
        convertFrom(value) {
            return Number.parseFloat(value) || "";
        },
    });

    const longitude = useCommonRouteQuery<string, number | string>("longitude", "", {
        convertTo(value) {
            return `${value}`;
        },
        convertFrom(value) {
            return Number.parseFloat(value) || "";
        },
    });

    return {
        latitude,
        longitude,
    };
}
