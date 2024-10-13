<script lang="ts" setup>
import { useFetchWeatherForecast } from "@/composables/pages/index/weather/useFetchWeatherForecast";
import WeatherForecast from "@/components/pages/index/WeatherForecast/index.vue";
import LocationSelectItem from "@/components/pages/index/WeatherForecast/LocationSelectItem.vue";

const { $toast, $http } = useNuxtApp();

const { fetchWeatherForecast, latitude, longitude } = useFetchWeatherForecast();

const location = ref<IApiGeoCodeItem | null>(null);

watch(
    location,
    (value) => {
        if (value === null) {
            return;
        }

        latitude.value = value.latitude;
        longitude.value = value.longitude;
    },
    {
        immediate: true,
        deep: true,
        flush: "pre",
    }
);

async function fetchLocation({ value, cback }: IAsyncSearchParam<string, any>) {
    try {
        const response = await $http.geoApi.get<{
            "results": IApiGeoCodeItem[];
            "generationtime_ms": number;
        }>(
            "v1/search",
            {
                "name": value || undefined,
            },
            {
                progress: false,
                loading: true,
                abortPrevious: true,
            }
        );

        const items = response.data.results;

        cback({
            items,
        });
    } catch (err: any) {
        if (!isRequestAbortedError(err)) {
            $toast.error(err);
            cback({
                items: [],
            });
            return;
        }
        cback({
            items: [],
            canceled: true,
        });
    }
}

const { data } = await fetchWeatherForecast();
</script>

<template>
    <div class="flex min-h-screen w-full items-center justify-center">
        <div class="mx-auto flex w-full max-w-[728px] flex-col gap-y-10">
            <BaseAutoCompleteAsync
                v-model="location"
                :item-name="(item) => item.name"
                :item-value="(item) => item"
                label="Location:"
                placeholder="Select"
                @search="fetchLocation"
            >
                <template #list-item="{ modelValue: value, item: lItem, ...props }">
                    <LocationSelectItem
                        v-bind="props"
                        :model-value="value"
                        :item="lItem"
                        :active="value?.id === lItem.id"
                /></template>
            </BaseAutoCompleteAsync>

            <WeatherForecast
                :key="`${latitude}-${longitude}`"
                :current-weather="data.current"
                :daily-weather="data.daily"
                :location="location"
            />
        </div>
    </div>
</template>
