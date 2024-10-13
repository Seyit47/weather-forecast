import mitt, { type Emitter } from "mitt";

declare module "#app" {
    interface NuxtApp {
        $eventBus: Emitter<TEventBusEvents>;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $eventBus: Emitter<TEventBusEvents>;
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            eventBus: mitt<TEventBusEvents>(),
        },
    };
});
