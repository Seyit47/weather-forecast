<template>
    <div>
        <div class="group">
            <label
                v-if="label"
                :class="{
                    'text-cl-red': invalid && !disabled,
                    'text-cl-passive-text': !invalid || disabled,
                }"
                class="mb-0.5 inline-block select-none pl-1 text-size_14/16 font-medium leading-[1.4] transition-colors duration-200"
            >
                {{ label }}
            </label>
            <div ref="wrapperEl" v-click-outside="clickOutsideOptions" class="relative flex">
                <div class="w-full">
                    <BaseDebounce
                        v-slot="{ modelValue: dModelValue, updateModelValue: updateDModelValue }"
                        v-model="searchQuery"
                        class="h-full w-full"
                    >
                        <BaseInput
                            ref="inputComp"
                            v-bind="$attrs"
                            :model-value="dModelValue"
                            :invalid="invalid"
                            :disabled="disabled"
                            :readonly="!!(shownAsChip && localModelValue)"
                            :class="{
                                'text-transparent': !!(shownAsChip && localModelValue),
                            }"
                            :placeholder="placeholder"
                            type="text"
                            autocomplete="off"
                            no-error
                            @focus="onFocus"
                            @keydown.enter.prevent="onEnter"
                            @keydown.backspace="onBackspace"
                            @keydown.up.prevent="onNavigate(-1)"
                            @keydown.down.prevent="onNavigate(1)"
                            @keydown.tab="onTabDown"
                            @update:model-value="updateDModelValue"
                        >
                            <template #prepend>
                                <div class="relative h-full">
                                    <div
                                        v-if="prependLabel"
                                        class="flex h-full items-center pl-3.5 pr-2"
                                    >
                                        <span class="text-size_14/16 font-medium leading-none">
                                            {{ prependLabel }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                            <template #append>
                                <div class="flex h-full w-full items-center px-3.5 py-1.5">
                                    <button
                                        v-if="clearable && !!localModelValue"
                                        :disabled="disabled"
                                        class="w-4 shrink-0 outline-none"
                                        type="button"
                                        @click="selectItem(null)"
                                    >
                                        <IconX />
                                    </button>

                                    <span
                                        :class="{
                                            'rotate-180': shown,
                                        }"
                                        class="w-5 shrink-0"
                                    >
                                        <IconChevronDown />
                                    </span>
                                </div>
                            </template>
                        </BaseInput>
                    </BaseDebounce>
                </div>

                <Teleport to="body">
                    <Transition
                        enter-from-class="opacity-0"
                        leave-to-class="opacity-0"
                        enter-active-class="transition transition-opacity duration-100"
                        leave-active-class="transition transition-opacity duration-100"
                    >
                        <BasePopup
                            v-if="shown"
                            ref="popupComp"
                            class="rounded-bl-[5px] rounded-br-[5px] shadow-sm"
                            @get-parent="$event(wrapperEl)"
                        >
                            <div class="flex flex-col text-size_14/16">
                                <div
                                    ref="itemsEl"
                                    :style="{
                                        maxHeight: `${maxItemsHeight}px`,
                                    }"
                                    class="overflow-y-auto"
                                >
                                    <template v-if="!loading && items.length > 0">
                                        <div
                                            v-for="(it, index) in items"
                                            :key="`${it}-${index}`"
                                            class="list-item"
                                        >
                                            <slot
                                                :model-value="localItem"
                                                :item="it"
                                                :index="index"
                                                :highlighted="index === navIndex"
                                                :title="itemName(it)"
                                                :item-name="itemName"
                                                :item-value="itemValue"
                                                :update-model-value="onSelect"
                                                name="list-item"
                                            >
                                                <CommonSelectItem
                                                    :model-value="localItem"
                                                    :item="it"
                                                    :index="index"
                                                    :highlighted="index === navIndex"
                                                    :title="itemName(it)"
                                                    :item-name="itemName"
                                                    :item-value="itemValue"
                                                    :update-model-value="onSelect"
                                                />
                                            </slot>
                                        </div>
                                    </template>
                                    <div
                                        v-else-if="!loading && items.length === 0"
                                        class="list-item py-0.5"
                                    >
                                        <CommonSelectItemEmpty />
                                    </div>
                                    <div v-else class="list-item py-0.5">
                                        <CommonSelectItemLoading />
                                    </div>
                                </div>
                            </div>
                        </BasePopup>
                    </Transition>
                </Teleport>

                <template v-if="!noError">
                    <Transition
                        enter-from-class="opacity-0"
                        leave-to-class="opacity-0"
                        enter-active-class="transition duration-200"
                        leave-active-class="transition duration-200"
                    >
                        <span
                            v-if="invalid && $slots['error-message']"
                            class="text-cl-red absolute left-[0.05rem] top-[110%] w-[calc(100%-0.1rem)] text-size_11/16 font-medium leading-[1.3]"
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
                            class="text-cl-passive-text absolute left-[0.05rem] top-[110%] w-[calc(100%-0.1rem)] text-size_11/16 font-medium leading-[1.3]"
                        >
                            <slot name="help-message" />
                        </span>
                    </Transition>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import vClickOutside from "@/directives/click-outside";
import BasePopup from "@/components/base/BasePopup.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { scrollToElement } from "@/utils/misc";

defineOptions({
    name: "BaseAutoCompleteAsync",
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        itemValue?: (value: any) => any;
        itemName?: (value: any) => any;
        label?: string;
        placeholder?: string;
        prependLabel?: string;
        invalid?: boolean;
        size?: string;
        popupMaxWMultiplier?: number;
        maxShownItems?: number;
        shownAsChip?: boolean;
        noError?: boolean;
        showHelp?: boolean;
        clearable?: boolean;
        disabled?: boolean;
        class?: any;
    }>(),
    {
        itemValue: (value: any) => value,
        itemName: (value: any) => value,
        label: "",
        placeholder: "",
        prependLabel: "",
        invalid: false,
        size: "md",
        popupMaxWMultiplier: 2,
        maxShownItems: 5,
        shownAsChip: false,
        noError: false,
        showHelp: false,
        clearable: true,
        disabled: false,
        class: "",
    }
);

const emit = defineEmits<{
    (e: "search", param: IAsyncSearchParam<string, any>): void;
}>();

const modelValue = defineModel<any>({
    default: null,
});

const modelItem = defineModel<any>("item", {
    default: undefined,
});

const itemName = toRef(props, "itemName");
const itemValue = toRef(props, "itemValue");

const localModelValue = computed({
    get(): any {
        return modelValue.value;
    },
    set(value: any) {
        if (props.disabled) {
            return;
        }
        modelValue.value = value;
    },
});

const localItem = computed({
    get() {
        if (modelItem.value !== undefined) {
            return modelItem.value;
        }

        return item_.value;
    },
    set(value) {
        if (modelItem.value !== undefined) {
            modelItem.value = value;
            return;
        }

        item_.value = value;
    },
});

const item_ = ref<any>(null);
const navIndex = ref(-1);
const shown = ref(false);
const searchQuery = ref("");
const loadCount = ref(0);
const loading = computed(() => loadCount.value > 0);
const maxItemsHeight = ref(0);
const items = ref<any[]>([]);
const skipSearch = ref(false);

const inputComp = ref<InstanceType<typeof BaseInput>>();
const popupComp = ref<InstanceType<typeof BasePopup>>();
const itemsEl = ref<HTMLElement>();
const wrapperEl = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();

onMounted(() => {
    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries.length === 0) {
                return;
            }
            if (!entries[0].isIntersecting) {
                reset();
            }
        },
        {
            threshold: 0.5,
        }
    );
});

const clickOutsideOptions = {
    handler: () => {
        if (shown.value) {
            reset();
        }
    },
    include: () => {
        if (popupComp.value) {
            return [popupComp.value.$el];
        }
        return [];
    },
};

watch(
    modelValue,
    () => {
        if (localModelValue.value === null && localItem.value === null) {
            return;
        }

        if (localModelValue.value !== null && localItem.value === null) {
            const item =
                items.value.find((item) => props.itemValue(item) === localModelValue.value) || null;

            selectItem(item);
            return;
        }

        if (localModelValue.value === null && localItem.value !== null) {
            selectItem(null);
            return;
        }

        if (localModelValue.value === props.itemValue(localItem.value)) {
            searchQuery.value = props.itemName(localItem.value);
            return;
        }

        localModelValue.value = null;
        localItem.value = null;
    },
    {
        flush: "post",
        immediate: true,
    }
);

watch(searchQuery, () => {
    if (skipSearch.value) {
        skipSearch.value = false;
        return;
    }

    if (searchQuery.value.length <= 1) {
        return;
    }

    shown.value = true;
    fetchItems(searchQuery.value);
});

watch(
    [shown, items],
    (value) => {
        if (value) {
            evaluatePopup();
        }
    },
    {
        flush: "post",
    }
);

watch(
    shown,
    (value) => {
        if (value) {
            observer.value?.observe(wrapperEl.value!);
        } else {
            observer.value?.disconnect();
        }
    },
    {
        immediate: true,
    }
);

onUpdated(evaluatePopup);

function evaluatePopup() {
    if (popupComp.value) {
        popupComp.value.evaluatePosition();
    }

    nextTick(evaluateMaxItemsHeight);
}

function onFocus() {
    if (props.disabled) {
        return;
    }
    if (shown.value) {
        return;
    }
    if (searchQuery.value === "") {
        return;
    }
    shown.value = true;
    fetchItems(searchQuery.value);
}

function onTabDown() {
    reset();
}

async function onSelect(item: any) {
    selectItem(item);
    await nextTick();
    reset();
}

function onBackspace() {
    if (!searchQuery.value) {
        selectItem(null);
    }
}

async function onEnter() {
    const index = navIndex.value;
    const length = items.value.length;

    navIndex.value = -1;
    if (index === -1 || index < 0 || index > length - 1) {
        return;
    }

    selectItem(items.value[index]);
    await nextTick();
    reset();
}

async function onNavigate(sign: 1 | -1) {
    if (props.disabled) {
        return;
    }

    const length = items.value.length;
    if (length === 0) {
        return;
    }

    let index = navIndex.value;
    index = index === -1 ? (sign === 1 ? -1 : 0) : index;
    navIndex.value = (length + index + sign) % length;

    await nextTick();

    const item = itemsEl.value?.querySelector(".highlighted");

    if (!itemsEl.value || !item) {
        return;
    }

    scrollToElement(itemsEl.value, item);
}

function selectItem(item: any) {
    skipSearch.value = true;

    if (item === null) {
        localItem.value = null;
        searchQuery.value = "";
        if (localModelValue.value !== null) {
            localModelValue.value = null;
        }
        return;
    }

    localItem.value = item;
    searchQuery.value = itemName.value(item);
    const value = itemValue.value(item);
    if (localModelValue.value !== value) {
        localModelValue.value = value;
    }
}

function reset() {
    inputComp.value?.blur();
    navIndex.value = -1;
    shown.value = false;
    items.value = [];
    selectItem(!searchQuery.value ? null : localItem.value);
}

function fetchItems(value: string = "") {
    navIndex.value = -1;
    loadCount.value++;
    items.value = [];

    emit("search", {
        value,
        cback: ({ items: newItems, canceled = false }) => {
            if (shown.value && !canceled) {
                items.value = newItems;
            }

            if (loadCount.value > 0) {
                loadCount.value--;
            }
        },
    });
}

function evaluateMaxItemsHeight() {
    const listItem = itemsEl.value?.querySelector(".list-item");
    if (!listItem) {
        maxItemsHeight.value = 0;
        return;
    }

    maxItemsHeight.value = props.maxShownItems * listItem.clientHeight + 2;
}
</script>
