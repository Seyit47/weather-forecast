import { type NuxtApp } from "#app";
import { getUrlPrefixedApi } from "@/utils/misc";

export class HttpApiService {
    private nuxtApp: NuxtApp;
    private abortControllerMap: {
        [key: string]: AbortController;
    } = {};

    private headers: Record<string, string> = {};
    fetch: ReturnType<typeof $fetch.create>;

    // eslint-disable-next-line no-use-before-define
    api: HttpApiService;
    // eslint-disable-next-line no-use-before-define
    geoApi: HttpApiService;

    constructor(nuxtApp: NuxtApp) {
        this.nuxtApp = nuxtApp;
        this.api = getUrlPrefixedApi(
            this,
            process.env.NODE_ENV === "production"
                ? `${nuxtApp.$config.public.FORECAST_SERVER_ORIGIN}/`
                : "/api/"
        );
        this.geoApi = getUrlPrefixedApi(
            this,
            process.env.NODE_ENV === "production"
                ? `${nuxtApp.$config.public.GEOCODING_SERVER_ORIGIN}/`
                : "/geo-api/"
        );
        this.fetch = $fetch.create({
            baseURL: "/",
        });
    }

    async get<RT>(
        url: string,
        query: Record<string, any> | undefined = undefined,
        {
            abortPrevious = false,
            loading = true,
            progress = true,
            headers = {},
        }: {
            abortPrevious?: boolean;
            loading?: boolean;
            progress?: boolean;
            headers?: Record<string, string>;
        } = {}
    ) {
        return await this.loadWrapper(
            () =>
                this.abortRequestWrapper(
                    (signal?: AbortSignal) =>
                        this.makeRequestWithRetry<RT>(() =>
                            this.fetch.raw<RT>(url, {
                                method: "GET",
                                query,
                                signal,
                                headers: {
                                    ...this.headers,
                                    ...headers,
                                },
                            })
                        ),
                    {
                        key: `get:${url}`,
                        abortPrevious,
                    }
                ),
            {
                loading,
                progress,
            }
        );
    }

    async loadWrapper<RT>(
        cback: () => RT,
        {
            progress = true,
            loading = true,
        }: {
            progress?: boolean;
            loading?: boolean;
        } = {}
    ) {
        if (!loading && !progress) {
            return cback();
        }

        if (loading) {
            this.nuxtApp.$load.increaseLoad();
        }
        if (progress) {
            this.nuxtApp.$load.increaseProgress();
        }
        try {
            return await cback();
        } finally {
            if (loading) {
                this.nuxtApp.$load.decreaseLoad();
            }
            if (progress) {
                this.nuxtApp.$load.decreaseProgress();
            }
        }
    }

    async abortRequestWrapper<RT>(
        cback: (signal?: AbortSignal) => RT,
        {
            key,
            abortPrevious = false,
        }: {
            key: string;
            abortPrevious: boolean;
        }
    ) {
        if (!abortPrevious) {
            return cback();
        }

        this.abortControllerMap[key]?.abort();
        this.abortControllerMap[key] = new AbortController();
        const signal = this.abortControllerMap[key].signal;
        try {
            return await cback(signal);
        } catch (err: any) {
            if (signal.aborted) {
                throw createRequestAbortedError();
            }
            throw err;
        } finally {
            if (!signal.aborted) {
                delete this.abortControllerMap[key];
            }
        }
    }

    async makeRequestWithRetry<RT>(cback: () => ReturnType<typeof $fetch.raw<RT>>) {
        try {
            return await this.makeRequest(cback);
        } catch (err: any) {
            if (isRequestRetryError(err)) {
                return await this.makeRequest(cback);
            }
            throw err;
        }
    }

    async makeRequest<RT>(cback: () => ReturnType<typeof $fetch.raw<RT>>) {
        const response = await cback();
        const data = response._data as RT;

        return {
            data,
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            type: response.type,
        };
    }

    abortRequest(key: string) {
        this.abortControllerMap[key]?.abort();
        delete this.abortControllerMap[key];
    }
}

declare module "#app" {
    interface NuxtApp {
        $http: HttpApiService;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $http: HttpApiService;
    }
}

export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp();
    const http = new HttpApiService(nuxtApp);
    return {
        provide: {
            http,
        },
    };
});
