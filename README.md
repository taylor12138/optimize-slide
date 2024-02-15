---
mobile: false
---
# 纯css轮播组件

组件描述
一个实用css手动实现的无限轮播组件,实际上是每次滑动到对应的轮播序号，会自动计算器左右“应该”存在的轮播内容，然后用translate进行移动，从而实现当前轮播组件的左右始终有组件“相伴”

参数：
```tsx
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

```


Demo:

```tsx
import React, { useRef } from 'react';
import OptimizeSlide from '@music/ct-optimize-slide';

// 轮播相关
const option = {
    className: 'slide-box',
    loop: true,
};

export default () => {
    // 左右轮播容器
    const slideRef = useRef<any>(null);

    const prev = () => {
        slideRef.current?.swipeToPre();
    };

    const next = () => {
        slideRef.current?.swipeToNext();
    };

    return (
        <div className="slide-ball">
            <OptimizeSlide ref={slideRef} {...option}>
                {TRUE_LOVE_LIST?.map?.((item: ILOVELIST) => {
                    return (
                        <div className="ball-wrapper" key={item?.type}>
                            <img src={item?.awardIcon} className="level" />
                            <div className="gift-info">
                                <img src={item?.giftUrl} className="gift-image" />
                                <div className="gift-info-right">
                                    <div className="gift-name">
                                        {item?.giftName}
                                        {item?.type !== 5 ? '1个' : ''}
                                    </div>
                                    <div className="gift-val">价值{item?.value}金币</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </OptimizeSlide>
            <div className="btn-controls">
                <div className="left" onClick={prev} />
                <div className="right" onClick={next} />
            </div>
        </div>
    )
};
```
