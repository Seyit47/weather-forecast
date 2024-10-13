import type { Emitter } from "mitt";
import type { ToastOptions } from "vue3-toastify";

export * from "./api";
export type { Emitter };

export type TEventBusEvents = {
    "show-toast": {
        message: any;
        options: {
            type: ToastOptions["type"];
            duration: number;
            position?: ToastOptions["position"];
        };
    };
    "transition-before-enter": any;
};

export interface IAsyncSearchParam<VT, RT> {
    value: VT;
    cback: (arg: { items: RT[]; canceled?: boolean }) => void;
}
