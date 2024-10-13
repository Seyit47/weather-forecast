export function getUrlPrefixedApi<T extends object & { [key: string]: any }>(
    instance: T,
    prefix: string,
    methods: any[] = ["get", "post", "put", "delete"]
) {
    return new Proxy<T>(instance, {
        get(target, property: string, receiver) {
            if (!methods.includes(property)) {
                return Reflect.get(target, property, receiver);
            }

            return new Proxy(target[property], {
                apply(target, thisArg, argList) {
                    const newArgList = argList.slice();
                    if (typeof newArgList[0] === "string") {
                        newArgList[0] = `${prefix}${newArgList[0]}`;
                    }
                    return Reflect.apply(target, thisArg, newArgList);
                },
            });
        },
    });
}

export function getMapFromArray(items: { [key: string]: any }[], key: string, valueKey: any) {
    const obj: { [key: string]: any } = {};

    for (const item of items) {
        obj[item[key]] = item[valueKey];
    }

    return obj;
}

export function scrollToElement(parent: Element, el: Element) {
    const rectH = el.getBoundingClientRect();
    const rectL = parent.getBoundingClientRect();

    if (rectH.y < rectL.y) {
        parent.scrollTop = parent.scrollTop + rectH.y - rectL.y;
    }

    if (rectH.y > rectL.y + rectL.height - rectH.height) {
        parent.scrollTop = parent.scrollTop + rectH.y - rectL.y - rectL.height + rectH.height;
    }
}

export function animate({
    draw,
    timing,
    duration,
}: {
    draw: (progress: number) => void;
    timing: (fraction: number) => number;
    duration: number;
}) {
    return new Promise<void>((resolve) => {
        const start = performance.now();
        const handler = (time: number) => {
            const fraction = Math.min((time - start) / duration, 1);
            draw(timing(fraction));
            if (fraction < 1) {
                requestAnimationFrame(handler);
            } else {
                resolve();
            }
        };
        requestAnimationFrame(handler);
    });
}

export async function scrollTo(to = 0, speed = 2000) {
    const from = Math.min(window.scrollY, 3000);
    const sign = from <= to ? 1 : -1;
    const length = Math.abs(from - to);
    const duration = Math.min((1000 * length) / speed, 500);
    return await animate({
        draw: (progress: number) => {
            window.scrollTo({
                top: from + sign * length * progress,
            });
        },
        timing: (fraction: number) => Math.sin((fraction * Math.PI) / 2),
        duration,
    });
}

export function truncate(value: string, length: number = 20) {
    let name = String(value);
    let ext = "";
    const index = name.lastIndexOf(".");
    if (index !== -1) {
        ext = name.substring(index);
        name = name.substring(0, index);
    }

    if (name.length > length) {
        name = `${name.substr(0, Math.floor((length - 3) / 2))}...${name.substr(
            name.length - Math.floor((length - 3) / 2)
        )}`;
    }
    return `${name}${ext}`;
}
