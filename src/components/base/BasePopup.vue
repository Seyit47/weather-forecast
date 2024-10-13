<script lang="ts" setup>
defineOptions({
    name: "BasePopup",
});

const props = withDefaults(
    defineProps<{
        maxWMultiplier?: number;
    }>(),
    {
        maxWMultiplier: 1,
    }
);

const emit = defineEmits<{
    (e: "get-parent", cb: (parent?: HTMLElement) => void): void;
}>();

const left = ref("");
const right = ref("");
const top = ref("");
const bottom = ref("");
const minWidth = ref("");
const maxWidth = ref("");
const onTop = ref(false);
const onRight = ref(false);
const lastHeight = ref(0);
const rootEl = ref<HTMLElement | null>(null);

onMounted(() => {
    window.addEventListener("scroll", evaluatePosition, {
        passive: true,
    });

    window.addEventListener("resize", evaluatePosition, {
        passive: true,
    });

    evaluatePosition().then(() => {
        adjustDocumentHeight();
    });
});

onUpdated(() => {
    evaluatePosition();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", evaluatePosition);
    window.removeEventListener("resize", evaluatePosition);
    document.documentElement.style.minHeight = "";
});

const evaluatePosition = () => {
    return new Promise<HTMLElement | undefined>((resolve) => {
        emit("get-parent", resolve);
    })
        .then((parent) => {
            const elem = rootEl.value;
            if (!elem || !parent) {
                return;
            }

            const rect = parent.getBoundingClientRect();
            const elemRect = elem.getBoundingClientRect();
            onTop.value =
                rect.top >= elemRect.height &&
                window.innerHeight - (rect.bottom + elemRect.height) <= 0;
            onRight.value = window.innerWidth - rect.right <= 0;
            top.value = onTop.value ? "auto" : `${rect.bottom}px`;
            bottom.value = onTop.value ? `${window.innerHeight - rect.top}px` : "auto";
            left.value = onRight.value ? "auto" : `${rect.left}px`;
            right.value = onRight.value ? `${rect.right}px` : "auto";
            minWidth.value = `${rect.width}px`;
            maxWidth.value = `${rect.width * props.maxWMultiplier}px`;
        })
        .catch((err) => {
            console.error(err);
        })
        .then(() => {
            adjustDocumentHeight();
        });
};

const adjustDocumentHeight = () => {
    nextTick(() => {
        const elem = rootEl.value;
        if (!elem) {
            return;
        }

        const elemRect = elem.getBoundingClientRect();
        const height = elemRect.height;
        if (lastHeight.value === height) {
            return;
        }

        lastHeight.value = height;
        if (window.innerHeight < height + window.scrollY + elemRect.top) {
            document.documentElement.style.minHeight = `${
                height + window.scrollY + elemRect.top
            }px`;
        } else {
            document.documentElement.style.minHeight = "";
        }
    });
};

defineExpose({
    evaluatePosition,
});
</script>

<template>
    <div
        ref="rootEl"
        class="border-cl-stroke shadow-c-popup fixed z-100 overflow-hidden rounded-[4px] border bg-white"
        :style="{
            minWidth: minWidth,
            maxWidth: maxWidth,
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        }"
    >
        <div class="relative">
            <slot />
        </div>
    </div>
</template>
