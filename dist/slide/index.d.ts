import React, { PureComponent } from 'react';
import './index.less';
export declare function myTransLateX(element: HTMLDivElement, val: number): void;
interface IProps {
    children?: Array<any>;
    className?: string;
    option?: {
        loop: boolean;
    };
}
interface IMoveEvent {
    deltaX: number;
    direction: typeDirection;
    distance: number;
    event: TouchEvent;
}
type typeDirection = 'Left' | 'Right' | 'Nochange';
export default class Slide extends PureComponent<IProps> {
    private width;
    private timerDuration;
    private timer;
    private justSwipe;
    private end;
    private n;
    private wrapper;
    total: number | undefined;
    private cur;
    private slideIndex;
    private translateVal;
    private translateCalVal;
    init(): void;
    unmount(): void;
    resetSize(): void;
    onPressStart(): void;
    onPressMove(props: IMoveEvent): void;
    onPressEnd(props: IMoveEvent): void;
    dragAction(deltaX: number): void;
    /**
     * 根据所要滑动的方向，让对应挂件出现在可视范围内
     * @param {*} index 需要处理的位置（slide位置）
     * @param {*} distance 此时滑动的距离
     * @param {*} isMoveWill true：将要到达的slide位置/false：原来的slide位置
     * @param {*} direction 方向
     */
    handleMoveIndex(index: number, distance: number, isMoveWill: boolean, direction: typeDirection): void;
    beforeSwipe(distance: number, direction: typeDirection): void;
    backOrigin(): void;
    swipeTo(direction: typeDirection): void;
    reset(): void;
    interval(): void;
    swipeToPre(): void;
    swipeToNext(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
export {};
