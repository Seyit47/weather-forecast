class ToastService {
    success(message: any, duration = 3000) {
        const { $eventBus } = useNuxtApp();
        $eventBus.emit("show-toast", {
            message,
            options: {
                type: "success",
                duration,
            },
        });
    }

    error(message: any, duration = 3000) {
        const { $eventBus } = useNuxtApp();
        $eventBus.emit("show-toast", {
            message,
            options: {
                type: "error",
                duration,
            },
        });
    }

    info(message: any, duration = 3000) {
        const { $eventBus } = useNuxtApp();
        $eventBus.emit("show-toast", {
            message,
            options: {
                type: "info",
                duration,
            },
        });
    }

    warning(message: any, duration = 3000) {
        const { $eventBus } = useNuxtApp();
        $eventBus.emit("show-toast", {
            message,
            options: {
                type: "warning",
                duration,
            },
        });
    }
}

declare module "#app" {
    interface NuxtApp {
        $toast: ToastService;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $toast: ToastService;
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            toast: new ToastService(),
        },
    };
});
