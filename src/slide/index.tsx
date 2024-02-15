/* eslint-disable @typescript-eslint/naming-convention */
import React, { PureComponent, createRef } from 'react';
import {
    EventBus,
    LEFT,
    MOVING,
    MOVINGEND,
    MOVINGSTART,
    requestAnimation,
    NOCHANGE,
    RIGHT,
    sleep,
} from './utils';
import Touch from './Touch';
import './index.less';

export function myTransLateX(element: HTMLDivElement, val: number) {
    // if (!element?.style) return;
    try {
        // eslint-disable-next-line no-param-reassign
        element.style.transform = `translateX(${val}px)`;
        // eslint-disable-next-line no-param-reassign
        element.style.webkitTransform = `translateX(${val}px)`;
    } catch (e) {
        console.warn(e, 'translate error');
    }
}

interface IProps {
    children?: Array<any>;
    className?: string;
    option?: {
        loop: boolean
    };
    ref: any;
    onLeft: (params?: any) => void;
    onRight: (params?: any) => void;
}

interface ITimer {
    cancel: () => void;
    pause: () => void;
    start: () => void;
}

interface IMoveEvent {
    deltaX: number;
    direction: typeDirection;
    distance: number;
    event: TouchEvent;
}

type typeDirection = 'Left' | 'Right' | 'Nochange';

export default class Slide extends PureComponent<IProps> {
    // slide轮播移动的宽度
    private width = 0;

    // slide轮播移动的高度（暂时用不上）
    // private height = 0;

    // 定时器时长，6秒一轮播
    private timerDuration = 6000;

    // 自动轮播
    private timer: ITimer | null = null;

    // 是否刚刚手动滑动
    private justSwipe = false;

    // 控制进入防抖的异步touchmove事件是否执行
    private end = false;

    // 当前滑动到的相对width的倍数 / 单位
    private n = 1;

    // 容器
    private wrapper = createRef<HTMLDivElement>();

    // slide个数
    total: number | undefined;

    // 当前播放的slide位置
    private cur = 0;

    // 当前播放的slideのindex序号
    private slideIndex = 0;

    // 当前translate位置
    private translateVal = 0;

    // 当前translate累计移动，一般用于计算拖动的距离
    private translateCalVal = 0;

    // 初始化
    init() {
        this.total = this.props?.children?.length; // slide个数

        // 如果轮播数小于等于1，不用初始化，不轮播，不可滑动
        if (typeof this.total !== 'number' || this.total < 1) {
            return;
        }

        new Touch(30);

        // 如果挂件数小于等于1，不用初始化，不轮播，不可滑动
        if (this.total <= 1) return;
        this.resetSize();

        // 先把事件监听的回调中方法里的this绑定一下，防止找不到当前Slide的this
        this.onPressMove = this.onPressMove.bind(this);
        this.onPressEnd = this.onPressEnd.bind(this);
        this.onPressStart = this.onPressStart.bind(this);

        EventBus.on(MOVING, this.onPressMove);
        EventBus.on(MOVINGEND, this.onPressEnd);
        EventBus.on(MOVINGSTART, this.onPressStart);

        if (this.props?.option?.loop) {
            this.interval();
        }
    }

    // 卸载
    unmount() {
        this.timer?.pause?.();
        this.timer?.cancel?.();
        this.timer = null;

        EventBus.off(MOVING);
        EventBus.off(MOVINGEND);
        EventBus.off(MOVINGSTART);
    }

    // 重新设定width、height
    resetSize() {
        let clientWd = 0;
        // let clientHg = 0;
        const { clientWidth } = this.wrapper.current || document.body;

        clientWd = clientWidth || document.body.clientWidth;
        // clientHg = clientHeight || document.body.clientHeight;

        this.width = clientWd;
        // this.height = clientHg;
    }

    // 触摸开始
    onPressStart() {
        if (this.timer) {
            this.timer?.pause();
        }

        this.backOrigin();
        this.end = false;
    }

    // 触摸移动
    onPressMove(props: IMoveEvent) {
        if (this.end) return;
        const {
            deltaX,
            direction,
            distance, // 矢量长度
        } = props || {};

        this.dragAction(deltaX);
        // 处理禁用一些默认行为
        // stopEvent(props?.event);
        this.beforeSwipe(distance, direction);
    }

    // 触摸结束
    onPressEnd(props: IMoveEvent) {
        this.end = true;
        const { wrapper } = this;

        // 错误处理
        if (!wrapper.current) {
            return;
        }

        (this.wrapper.current as any).style.transition = 'transform .5s';
        if (props?.direction === NOCHANGE) {
            this.translateCalVal = 0;
            myTransLateX(wrapper.current, this.translateVal);
        } else if (props?.direction === LEFT) {
            this.swipeTo(LEFT);
        } else if (props?.direction === RIGHT) {
            this.swipeTo(RIGHT);
        }

        this.reset();
        this.justSwipe = true;
        if (this.timer) {
            this.timer?.start?.(); // 重新开始自动轮播
        }
    }

    // 拖动效果
    dragAction(deltaX: number) {
        // 错误处理
        if (!this.wrapper.current) {
            return;
        }

        if (deltaX !== 0 && deltaX) {
            this.translateCalVal += deltaX;
        }
        myTransLateX(this.wrapper.current, this.translateVal + this.translateCalVal);
    }

    /**
     * 根据所要滑动的方向，让对应挂件出现在可视范围内
     * @param {*} index 需要处理的位置（slide位置）
     * @param {*} distance 此时滑动的距离
     * @param {*} isMoveWill true：将要到达的slide位置/false：原来的slide位置
     * @param {*} direction 方向
     */
    handleMoveIndex(
        index: number,
        distance: number,
        isMoveWill: boolean,
        direction: typeDirection
    ) {
        const { total, wrapper, width } = this;
        let needToTranslateIndex = index;

        // 错误处理
        if (!total || total < 1 || !wrapper.current) {
            return;
        }

        // 在正常范围
        if (needToTranslateIndex >= 0 && needToTranslateIndex <= total - 1) {
            myTransLateX(wrapper.current?.children[index] as HTMLDivElement, 0);
        } else if (direction === RIGHT) {
            // 需要translate的slide下标
            needToTranslateIndex = (total - (Math.abs(index) % total)) % total;
            const originIndex = isMoveWill ? this.slideIndex : this.slideIndex + 1;

            // 需要translate的长度
            const len = Math.floor((distance - originIndex * width) / (total * width)) + 1;

            myTransLateX(
                wrapper.current?.children[needToTranslateIndex] as HTMLDivElement,
                -total * width * len
            );
        } else {
            // 需要translate的slide下标
            needToTranslateIndex = index % total;
            const originIndex = isMoveWill ? total - 1 - this.slideIndex : total - this.slideIndex;

            // 需要translate的长度
            const len = Math.floor((distance - originIndex * width) / (total * width)) + 1;
            myTransLateX(
                wrapper.current.children[needToTranslateIndex] as HTMLDivElement,
                total * width * len
            );
        }
    }

    // 滑动前置处理
    beforeSwipe(distance: number, direction: typeDirection) {
        const { width } = this;
        const n = Math.floor(distance / width); // 当前滑动到的相对width的倍数 / 单位

        // 左滑
        if (direction === LEFT) {
            const moveWill = this.cur + n + 1; // touchMove，移动中将要到达的slide的位置
            const moveOrigin = this.cur + n; // touchMove，移动中原来的slide的位置
            this.handleMoveIndex(moveWill, distance, true, LEFT);
            this.handleMoveIndex(moveOrigin, distance, false, LEFT);
        }

        // 右滑
        if (direction === RIGHT) {
            const moveWill = this.cur - n - 1; // touchMove，移动中将要到达的slide的位置
            const moveOrigin = this.cur - n; // touchMove，移动中原来的slide的位置
            this.handleMoveIndex(moveWill, distance, true, RIGHT);
            this.handleMoveIndex(moveOrigin, distance, false, RIGHT);
        }

        if (n > 0) {
            // 改成四舍五入
            this.n = Math.round(distance / width);
        } else {
            this.n = 1;
        }
    }

    // 处理this.cur,让所有挂件回到原来的的位置
    backOrigin() {
        const {
            wrapper, width, total, slideIndex
        } = this;

        // 过滤掉出问题的地方
        if (!wrapper?.current || !total || !Array.isArray(this.props.children)) return;

        // 取消动画的过渡时间，让拖动恢复正常
        wrapper.current.style.transition = '';
        // 当前cur转换成slideIndex
        this.cur = slideIndex;

        // 轮播子元素回归原位
        for (let i = 0; i < total; i++) {
            myTransLateX(this.wrapper.current?.children[i] as any, 0);
        }
        // 轮播容器回归当前slideIndex对应位置
        myTransLateX(wrapper.current, slideIndex * -width);

        // 重要的一步：根据当前slideIndex重制translateVal的值
        this.translateVal = -slideIndex * width;
    }

    // 从cur位置切换至next位置
    swipeTo(direction: typeDirection) {
        const { wrapper, width, total } = this;
        this.cur = direction === RIGHT ? this.cur - this.n : this.cur + this.n;

        // 错误处理
        if (!total || total < 1 || !wrapper.current) {
            return;
        }

        if (this.cur < 0) {
            // 指向当前滑动到的slide序号。且保证slideIndex为正确的下标，不为负数
            this.slideIndex = (total - (Math.abs(this.cur) % total)) % total;
        } else {
            this.slideIndex = this.cur % total;
        }

        this.translateCalVal = direction === RIGHT ? width * this.n : -width * this.n;
        this.translateVal += this.translateCalVal;

        myTransLateX(wrapper.current, this.translateVal);

        if(direction === RIGHT) {
            this.props?.onRight(this.cur);
        } else {
            this.props?.onLeft(this.cur);            
        }
    }

    // 重置操作
    reset() {
        this.translateCalVal = 0;
        this.n = 1;
    }

    // 自动轮播其实就是走一遍滑动的流程
    interval() {
        if (!this.wrapper.current) {
            return;
        }

        this.timer = requestAnimation(() => {
            this.backOrigin();
            // 刚刚滑动过，先不轮播
            if (this.justSwipe) {
                this.justSwipe = false;
            } else {
                sleep().then(() => {
                    // 放在异步是为了让css和js动画能按顺序执行和渲染
                    // 模拟左滑
                    this.beforeSwipe(1, LEFT);
                    (this.wrapper.current as any).style.transition = 'transform .5s';
                    this.swipeTo(LEFT);
                    this.reset();
                });
            }
        }, this.timerDuration);
    }

    // 轮播到上一个
    swipeToPre() {
        this.backOrigin();
        sleep().then(() => {
            // 放在异步是为了让css和js动画能按顺序执行和渲染
            this.beforeSwipe(1, RIGHT);
            (this.wrapper.current as any).style.transition = 'transform .5s';
            this.swipeTo(RIGHT);
            this.reset();
        });
    }

    // 轮播到下一个
    swipeToNext() {
        this.backOrigin();
        sleep().then(() => {
            // 放在异步是为了让css和js动画能按顺序执行和渲染
            this.beforeSwipe(1, LEFT);
            (this.wrapper.current as any).style.transition = 'transform .5s';
            this.swipeTo(LEFT);
            this.reset();
        });
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        this.unmount();
    }

    render() {
        return (
            <div
                className={
                    this.props?.className ? `basic-slide ${this.props?.className}` : 'basic-slide'
                }>
                <div className="basic-slide-wrapper" ref={this.wrapper}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
