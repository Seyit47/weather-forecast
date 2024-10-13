// Source: https://github.com/vueuse/vueuse/blob/main/packages/router/useRouteQuery/index.ts
// Modified transform option to be more flexible

import {
    customRef,
    nextTick,
    watch,
    toValue,
    getCurrentScope,
    onScopeDispose,
    type MaybeRef,
    type Ref,
    type MaybeRefOrGetter,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Router, RouteParamValueRaw } from "vue-router";

export type RouteQueryValueRaw = RouteParamValueRaw | string[];

export type RouteHashValueRaw = string | null | undefined;

export interface ReactiveRouteOptions {
    /**
     * Mode to update the router query, ref is also acceptable
     *
     * @default 'replace'
     */
    mode?: MaybeRef<"replace" | "push">;

    /**
     * Route instance, use `useRoute()` if not given
     */
    route?: ReturnType<typeof useRoute>;

    /**
     * Router instance, use `useRouter()` if not given
     */
    router?: ReturnType<typeof useRouter>;
}

export interface ReactiveRouteOptionsWithTransform<V, R> extends ReactiveRouteOptions {
    /**
     * Function to transform data before return
     */
    convertTo?: (value: R) => V;
    convertFrom?: (value: V) => R;
}

const _queue = new WeakMap<Router, Map<string, any>>();

export function useCommonRouteQuery(name: string): Ref<null | string | string[]>;

export function useCommonRouteQuery<T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T>(
    name: string,
    defaultValue?: MaybeRefOrGetter<T>,
    options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>;

export function useCommonRouteQuery<T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T>(
    name: string,
    defaultValue?: MaybeRefOrGetter<T>,
    options: ReactiveRouteOptionsWithTransform<T, K> = {}
): Ref<K> {
    const {
        mode = "replace",
        route = useRoute(),
        router = useRouter(),
        convertTo = (value) => `${value}` as any as T,
        convertFrom = (value) => value as any as K,
    } = options;

    if (!_queue.has(router)) {
        _queue.set(router, new Map());
    }

    const _queriesQueue = _queue.get(router)!;

    const routePath = route.path;

    let queryRaw = route.query[name] as any;
    let queryValue: K | undefined = convertFrom(
        queryRaw !== undefined ? queryRaw : toValue(defaultValue)
    );

    if (getCurrentScope()) {
        onScopeDispose(() => {
            queryValue = undefined;
            queryRaw = undefined;
        });
    }

    let _trigger: () => void;

    const proxy = customRef<any>((track, trigger) => {
        _trigger = trigger;

        return {
            get() {
                track();

                return queryValue;
            },
            set(value) {
                const raw = convertTo(value);
                if (queryRaw === raw) {
                    return;
                }

                queryRaw = raw;
                queryValue = value;

                _queriesQueue.set(name, queryRaw);

                trigger();

                nextTick(() => {
                    if (_queriesQueue.size === 0) {
                        return;
                    }

                    const newQueries = Object.fromEntries(_queriesQueue.entries());
                    _queriesQueue.clear();

                    const { params, query, hash } = route;

                    router[toValue(mode)]({
                        params,
                        query: {
                            ...query,
                            ...newQueries,
                        },
                        hash,
                    });
                });
            },
        };
    });

    watch(
        () => route.query[name],
        (value) => {
            if (routePath !== route.path || queryRaw === value) {
                return;
            }

            queryRaw = value;
            queryValue = convertFrom(queryRaw !== undefined ? queryRaw : toValue(defaultValue));
            _trigger();
        },
        {
            flush: "sync",
        }
    );

    return proxy as any as Ref<K>;
}
