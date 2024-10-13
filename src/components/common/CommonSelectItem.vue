<template>
    <label
        :class="{
            'bg-gray-200': disabled,
            'bg-gray-200 hover:bg-gray-300': !disabled && active,
            'bg-[#F5F5F5] hover:bg-gray-200':
                !disabled && !active && index % 2 === 0 && !highlighted,
            'bg-white hover:bg-gray-200': !disabled && !active && index % 2 !== 0 && !highlighted,
            'bg-gray-300': !disabled && highlighted && active,
            'highlighted bg-gray-200': !disabled && highlighted && !active,
        }"
        :title="title"
        class="flex h-12.5 cursor-pointer items-center px-3.5 py-1.5"
        @click="onSelect"
    >
        <span :title="title" class="w-full overflow-hidden whitespace-nowrap">
            {{ itemName(item) }}
        </span>
    </label>
</template>

<script lang="ts" setup>
defineOptions({
    name: "CommonSelectItem",
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        title?: string;
        item?: any;
        index: number;
        disabled?: boolean;
        highlighted: boolean;
        itemName?: (item: any) => any;
        itemValue?: (item: any) => any;
        updateModelValue?: (item: any) => any;
    }>(),
    {
        modelValue: "",
        title: "",
        item: null,
        disabled: false,
        itemName: () => {},
        itemValue: () => {},
        updateModelValue: () => {},
    }
);

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        props.updateModelValue(value);
    },
});

const active = computed(() => {
    return localModelValue.value !== null
        ? props.itemValue(localModelValue.value) === props.itemValue(props.item)
        : false;
});

function onSelect() {
    if (props.disabled) {
        return;
    }
    localModelValue.value = props.item;
}
</script>
