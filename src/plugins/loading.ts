class LoadingService {
    loadCount = ref(0);
    progressCount = ref(0);
    isLoading = computed(() => this.loadCount.value > 0);
    isProgressing = computed(() => this.progressCount.value > 0);

    increaseLoad() {
        this.loadCount.value++;
    }

    decreaseLoad() {
        if (this.loadCount.value > 0) {
            this.loadCount.value--;
        }
    }

    increaseProgress() {
        this.progressCount.value++;
    }

    decreaseProgress() {
        if (this.progressCount.value > 0) {
            this.progressCount.value--;
        }
    }
}

declare module "#app" {
    interface NuxtApp {
        $load: LoadingService;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $load: LoadingService;
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            load: new LoadingService(),
        },
    };
});
