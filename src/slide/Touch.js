import {
    EventBus, LEFT, MOVING, MOVINGEND, MOVINGSTART, NOCHANGE, RIGHT
} from './utils';

export default class Touch {
    constructor(touchLen = 30, container) {
        this.container = container || window.document.body;
        this.now = null; // 当前时间
        this.end = null; // 触摸结束时间
        this.startX = null; // 手指落下去的x坐标
        this.x1 = null; // 滑动开始的x坐标
        this.x2 = null; // 滑动结束的x坐标
        this.isMove = false;
        this.touchLen = touchLen; // 设定左滑右滑的标准长度
        this.flag = true;

        // this绑定
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.init();
    }

    init() {
        this.container.addEventListener('touchstart', this.handleTouchStart, false);
        this.container.addEventListener('touchmove', this.handleTouchMove, false);
        this.container.addEventListener('touchend', this.handleTouchEnd, false);
    }

    unmount() {
        this.container.removeEventListener('touchstart', this.handleTouchStart, false);
        this.container.removeEventListener('touchmove', this.handleTouchMove, false);
        this.container.removeEventListener('touchend', this.handleTouchEnd, false);
    }

    // 滑动方向
    swipeDirection() {
        // 大于150像素 / 一个大于30像素的快速滑动
        if (Math.abs(this.x1 - this.x2) > this.touchLen || this.end - this.now < 250) {
            return this.x1 - this.x2 > 0 ? LEFT : RIGHT;
        }
        return NOCHANGE;
    }

    // 触摸开始
    handleTouchStart(event) {
        this.now = Date.now();
        const { pageX } = event.touches[0];
        const currentX = pageX < 0 ? 0 : pageX;
        this.x1 = currentX;
        this.x2 = null;
        EventBus.emit(MOVINGSTART, { event }); // 发送触摸开始事件
    }

    // 触摸移动
    handleTouchMove(event) {
        const { pageX } = event.touches[0];
        const currentX = pageX;
        const option = { event };

        // moving中每次的矢量距离
        if (this.x2 !== null) {
            option.deltaX = currentX - this.x2;
            option.distance = Math.abs(this.x1 - this.x2);
            option.vectorDis = this.x1 - this.x2;
        } else {
            option.deltaX = currentX - this.x1;
            option.distance = Math.abs(currentX - this.x1);
            option.vectorDis = this.x1 - currentX;
        }

        this.x2 = currentX;
        this.isMove = Math.abs(this.x2 - this.x1) > 1;
        option.isMove = this.isMove;
        option.direction = this.swipeDirection();
        EventBus.emit(MOVING, option);
    }

    // 触摸结束
    handleTouchEnd(event) {
        this.end = Date.now();
        const option = { event };

        if (this.x2 !== null && Math.abs(this.x1 - this.x2) > this.touchLen) {
            option.direction = this.swipeDirection();
            option.distance = Math.abs(this.x1 - this.x2);
            option.distanceY = Math.abs(this.y1 - this.y2);
            option.quick = this.end - this.now < 250;
        } else option.direction = NOCHANGE;

        this.x1 = null;
        this.x2 = null;
        this.isMove = false;
        EventBus.emit(MOVINGEND, option); // 发送触摸结束事件
    }
}
