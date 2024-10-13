<script lang="ts" setup>
defineOptions({
    name: "BaseDebounce",
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        delay?: number;
    }>(),
    {
        delay: 500,
    }
);

const modelValue = defineModel<any>({
    required: true,
});

let timer = -1;
function updateModelValue(value: any) {
    if (props.delay <= 50) {
        modelValue.value = value;
    } else {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            modelValue.value = value;
        }, props.delay);
    }
}
</script>

<template>
    <slot :model-value="modelValue" :update-model-value="updateModelValue" />
</template>
