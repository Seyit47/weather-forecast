<script lang="ts" setup>
import { toast, type ToastOptions } from "vue3-toastify";
import { getMessage } from "@/utils/toast";
import "vue3-toastify/dist/index.css";

defineOptions({
    name: "AppToast",
});

const { $eventBus } = useNuxtApp();

async function showToast({
    message = "",
    options: { type = "info", position = "top-right", duration = 3000 } = {},
}: {
    message?: any;
    options?: {
        type?: ToastOptions["type"];
        position?: ToastOptions["position"];
        duration?: number;
    };
} = {}) {
    const msgs = getMessage(message);
    for (const msg of msgs) {
        if (type === "error") {
            console.error(msg);
        } else if (type === "warning") {
            console.warn(msg);
        }

        await new Promise<void>((resolve) => {
            setTimeout(resolve);
        });

        setTimeout(() => {
            toast(msg, {
                type,
                position,
                autoClose: duration,
                theme: "colored",
                transition: "bounce",
            });
        }, 4);
    }
}

onMounted(() => {
    $eventBus.on("show-toast", showToast);
});

onBeforeUnmount(() => {
    $eventBus.off("show-toast", showToast);
});
</script>

<template>
    <div></div>
</template>
