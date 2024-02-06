class EventBusClass {
    constructor() {
        this.eventMap = {};
    }

    on(eventName, callback) {
        const cbs = this.eventMap[eventName] || [];
        if (cbs.indexOf(callback) === -1) {
            cbs.push(callback);
        }
        this.eventMap[eventName] = cbs;
    }

    off(eventName, callback = null) {
        const cbs = this.eventMap[eventName];
        if (!cbs) return;

        if (callback) {
            const idx = cbs.indexOf(callback);
            if (idx !== -1) {
                cbs.splice(idx, 1);
            }
            this.eventMap[eventName] = cbs;
        } else {
            this.eventMap[eventName] = undefined;
        }
    }

    emit(eventName, ...args) {
        const cbs = this.eventMap[eventName] || [];
        if (!cbs) return;

        cbs.forEach((cb) => cb.apply(this, args));
    }
}

export const EventBus = new EventBusClass();
EventBus.create = () => new EventBusClass();

export const MOVING = '::滑动事件::';
export const MOVINGEND = '::滑动结束事件::';
export const MOVINGSTART = '::滑动开始事件::';

export const LEFT = 'Left';
export const RIGHT = 'Right';
export const NOCHANGE = 'Nochange';

// 定时任务
export function requestAnimation(callback, delay = 1500, firstRun = false) {
    let running = true,
        prevTime = 0,
        pause = false;

    const invoke = () => {
        if (callback) callback();
    };

    function innerCallback(time) {
        const diff = time - prevTime;
        if (diff >= delay && !pause) {
            prevTime = time;
            invoke();
        }
        if (running) {
            window.requestAnimationFrame(innerCallback);
        }
    }

    if (firstRun) {
        invoke();
    }

    window.requestAnimationFrame(innerCallback);
    return {
        cancel: () => {
            running = false;
        },
        pause: () => {
            pause = true;
        },
        start: () => {
            pause = false;
        },
    };
}

export function myTransLateX(element, val) {
    // if (!element?.style) return;
    // eslint-disable-next-line no-param-reassign
    element.style.transform = `translateX(${val}px)`;
    // eslint-disable-next-line no-param-reassign
    element.style.webkitTransform = `translateX(${val}px)`;
}

// 阻止原生g滚动事件
export const stopEvent = (e) => {
    if (e === undefined) return;
    e.stopPropagation();
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e?.preventDefault?.();
        }
    }
};

export const sleep = (delay = 10) => new Promise((reslove) => {
    setTimeout(() => {
        reslove();
    }, delay);
});
