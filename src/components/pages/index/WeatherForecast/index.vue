<script lang="ts" setup>
import { fallbackIconCode, weatherIcons } from "@/utils/weather";

defineProps<{
    currentWeather: IApiCurrentForecast | null;
    dailyWeather: IApiDailyForecast[];
    location: IApiGeoCodeItem | null;
}>();
</script>

<template>
    <div class="flex w-full flex-col gap-y-10">
        <div v-if="currentWeather" class="flex flex-col">
            <div v-if="location" class="ml-2.5 flex items-center gap-x-0.5">
                <div class="w-4">
                    <IconLocation />
                </div>
                <span class="text-size_14/16 font-medium">{{ location.name }}</span>
            </div>
            <div class="flex items-center">
                <span class="h-16 w-16 overflow-hidden">
                    <component
                        :is="weatherIcons[currentWeather.weather_code].day"
                        v-if="currentWeather.is_day === 1"
                    />
                    <component :is="weatherIcons[currentWeather.weather_code].night" v-else />
                </span>
                <span class="text-size_24/16 font-medium"
                    >{{
                        currentWeather.temperature_2m >= 0
                            ? `+${Math.round(currentWeather.temperature_2m)}`
                            : Math.round(currentWeather.temperature_2m)
                    }}
                    °C</span
                >
            </div>
            <span class="ml-3.5 text-size_14/16 text-black/80">{{
                formatDate(currentWeather.time)
            }}</span>
        </div>

        <div class="grid grid-cols-[repeat(14,minmax(0,1fr))]">
            <div
                v-for="(item, index) in dailyWeather"
                :key="index"
                class="col-span-2 flex flex-col items-center"
            >
                <span class="text-size_14/16 font-medium">{{ formatDayOfWeek(item.time) }}</span>
                <span class="h-16 w-16 overflow-hidden">
                    <component :is="weatherIcons[item.weather_code || fallbackIconCode].day" />
                </span>
                <div class="flex items-center gap-x-1.5">
                    <span class="text-size_14/16 font-medium"
                        >{{ Math.round(item.max_temp) }}°</span
                    >
                    <span class="text-size_14/16 text-gray-500"
                        >{{ Math.round(item.min_temp) }}°</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>
