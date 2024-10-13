<script lang="ts" setup>
defineOptions({
    name: "BaseInput",
    inheritAttrs: false,
});

withDefaults(
    defineProps<{
        label?: string;
        inputId?: string;
        size?: string;
        invalid?: boolean;
        disabled?: boolean;
        noError?: boolean;
        showHelp?: boolean;
        class?: string;
    }>(),
    {
        label: "",
        inputId: undefined,
        size: "md",
        invalid: false,
        disabled: false,
        noError: false,
        showHelp: false,
        class: "",
    }
);

const padLeft = ref("");
const padRight = ref("");
const inputEl = ref<HTMLInputElement>();
const prependEl = ref<HTMLElement>();
const appendEl = ref<HTMLElement>();

const localValue = defineModel<string | number>("modelValue", {
    default: "",
});

onMounted(() => {
    evaluatePaddings();
});

function blur() {
    inputEl.value?.blur();
}

function focus() {
    inputEl.value?.focus();
}

function evaluatePaddings() {
    if (prependEl.value) {
        const w = prependEl.value.clientWidth;
        padLeft.value = w > 0 ? `${prependEl.value.clientWidth}px` : "";
    }
    if (appendEl.value) {
        const w = appendEl.value.clientWidth;
        padRight.value = w > 0 ? `${appendEl.value.clientWidth}px` : "";
    }
}

defineExpose({
    inputEl,
    focus,
    blur,
});
</script>

<template>
    <div :class="[$props.class]">
        <label
            v-if="label"
            :for="inputId"
            class="mb-0.5 inline-block select-none pl-1 text-size_14/16 leading-[1.4] transition-colors duration-150"
        >
            {{ label }}
        </label>
        <div class="relative">
            <input
                :id="inputId"
                ref="input"
                v-model="localValue"
                v-bind="$attrs"
                :disabled="disabled"
                :style="{
                    paddingLeft: padLeft,
                    paddingRight: padRight,
                }"
                :class="{
                    'border-cl-red placeholder-cl-red': invalid && !disabled,
                    'placeholder:text-gray-400 hover:border-cl-green/60 focus:border-cl-green active:border-cl-green':
                        !invalid && !disabled,
                }"
                class="block h-12.5 w-full appearance-none rounded-[5px] border bg-white px-3.5 py-1.5 text-size_14/16 font-normal shadow-sm outline-none transition-colors duration-150 placeholder:font-normal disabled:bg-gray-100 disabled:text-gray-500 disabled:shadow-none"
                autocomplete="off"
            />

            <div
                v-if="$slots.prepend"
                ref="prepend"
                class="absolute left-0 top-0 h-full outline-none transition-colors duration-150"
                @click="focus"
            >
                <slot name="prepend" />
            </div>

            <div
                v-if="$slots.append"
                ref="append"
                class="absolute right-0 top-0 h-full outline-none transition-colors duration-150"
                @click="focus"
            >
                <slot name="append" />
            </div>

            <template v-if="!noError">
                <Transition
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                    enter-active-class="transition duration-200"
                    leave-active-class="transition duration-200"
                >
                    <span
                        v-if="invalid && $slots['error-message']"
                        class="absolute left-[0.05rem] top-[calc(100%+0.2rem)] w-[calc(100%-0.1rem)] text-size_11/16 font-medium leading-[1.3] text-cl-red"
                    >
                        <slot name="error-message" />
                    </span>
                </Transition>
            </template>

            <template v-if="showHelp">
                <Transition
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                    enter-active-class="transition duration-200"
                    leave-active-class="transition duration-200"
                >
                    <span
                        v-if="!invalid && $slots['help-message']"
                        class="absolute left-[0.05rem] top-[calc(100%+0.2rem)] w-[calc(100%-0.1rem)] text-size_11/16 font-medium leading-[1.3] text-gray-500"
                    >
                        <slot name="help-message" />
                    </span>
                </Transition>
            </template>
        </div>
    </div>
</template>
