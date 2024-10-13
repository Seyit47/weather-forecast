<template>
    <label class="flex select-none items-center justify-center bg-white px-2 py-1.5">
        <span class="w-5">
            <IconLoading />
        </span>
    </label>
</template>

<script lang="ts" setup>
import IconLoading from "@/components/icons/IconLoading.vue";

defineOptions({
    name: "BaseAutocompleteLoading",
});
</script>
