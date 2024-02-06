'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}

var EventBusClass = /*#__PURE__*/function () {
  function EventBusClass() {
    _classCallCheck(this, EventBusClass);
    this.eventMap = {};
  }
  _createClass(EventBusClass, [{
    key: "on",
    value: function on(eventName, callback) {
      var cbs = this.eventMap[eventName] || [];
      if (cbs.indexOf(callback) === -1) {
        cbs.push(callback);
      }
      this.eventMap[eventName] = cbs;
    }
  }, {
    key: "off",
    value: function off(eventName) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var cbs = this.eventMap[eventName];
      if (!cbs) return;
      if (callback) {
        var idx = cbs.indexOf(callback);
        if (idx !== -1) {
          cbs.splice(idx, 1);
        }
        this.eventMap[eventName] = cbs;
      } else {
        this.eventMap[eventName] = undefined;
      }
    }
  }, {
    key: "emit",
    value: function emit(eventName) {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var cbs = this.eventMap[eventName] || [];
      if (!cbs) return;
      cbs.forEach(function (cb) {
        return cb.apply(_this, args);
      });
    }
  }]);
  return EventBusClass;
}();
var EventBus = new EventBusClass();
EventBus.create = function () {
  return new EventBusClass();
};
var MOVING = '::滑动事件::';
var MOVINGEND = '::滑动结束事件::';
var MOVINGSTART = '::滑动开始事件::';
var LEFT = 'Left';
var RIGHT = 'Right';
var NOCHANGE = 'Nochange';

// 定时任务
function requestAnimation(callback) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1500;
  var firstRun = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var running = true,
    prevTime = 0,
    _pause = false;
  var invoke = function invoke() {
    if (callback) callback();
  };
  function innerCallback(time) {
    var diff = time - prevTime;
    if (diff >= delay && !_pause) {
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
    cancel: function cancel() {
      running = false;
    },
    pause: function pause() {
      _pause = true;
    },
    start: function start() {
      _pause = false;
    }
  };
}
var sleep = function sleep() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  return new Promise(function (reslove) {
    setTimeout(function () {
      reslove();
    }, delay);
  });
};

var Touch = /*#__PURE__*/function () {
  function Touch() {
    var touchLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
    var container = arguments.length > 1 ? arguments[1] : undefined;
    _classCallCheck(this, Touch);
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
  _createClass(Touch, [{
    key: "init",
    value: function init() {
      this.container.addEventListener('touchstart', this.handleTouchStart, false);
      this.container.addEventListener('touchmove', this.handleTouchMove, false);
      this.container.addEventListener('touchend', this.handleTouchEnd, false);
    }
  }, {
    key: "unmount",
    value: function unmount() {
      this.container.removeEventListener('touchstart', this.handleTouchStart, false);
      this.container.removeEventListener('touchmove', this.handleTouchMove, false);
      this.container.removeEventListener('touchend', this.handleTouchEnd, false);
    }

    // 滑动方向
  }, {
    key: "swipeDirection",
    value: function swipeDirection() {
      // 大于150像素 / 一个大于30像素的快速滑动
      if (Math.abs(this.x1 - this.x2) > this.touchLen || this.end - this.now < 250) {
        return this.x1 - this.x2 > 0 ? LEFT : RIGHT;
      }
      return NOCHANGE;
    }

    // 触摸开始
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(event) {
      this.now = Date.now();
      var pageX = event.touches[0].pageX;
      var currentX = pageX < 0 ? 0 : pageX;
      this.x1 = currentX;
      this.x2 = null;
      EventBus.emit(MOVINGSTART, {
        event: event
      }); // 发送触摸开始事件
    }

    // 触摸移动
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(event) {
      var pageX = event.touches[0].pageX;
      var currentX = pageX;
      var option = {
        event: event
      };

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
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd(event) {
      this.end = Date.now();
      var option = {
        event: event
      };
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
  }]);
  return Touch;
}();

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".basic-slide {\n  width: 100%;\n  height: 100%;\n  list-style: none;\n  overflow: hidden;\n}\n.basic-slide .basic-slide-wrapper {\n  display: flex;\n  flex-wrap: nowrap;\n}\n.basic-slide .basic-slide-wrapper > div {\n  flex-shrink: 0;\n}\n";
styleInject(css_248z);

function myTransLateX(element, val) {
  // if (!element?.style) return;
  try {
    // eslint-disable-next-line no-param-reassign
    element.style.transform = "translateX(".concat(val, "px)");
    // eslint-disable-next-line no-param-reassign
    element.style.webkitTransform = "translateX(".concat(val, "px)");
  } catch (e) {
    console.warn(e, 'translate error');
  }
}
var Slide = /*#__PURE__*/function (_PureComponent) {
  _inherits(Slide, _PureComponent);
  function Slide() {
    var _this;
    _classCallCheck(this, Slide);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Slide, [].concat(args));
    // slide轮播移动的宽度
    _defineProperty(_assertThisInitialized(_this), "width", 0);
    // slide轮播移动的高度（暂时用不上）
    // private height = 0;
    // 定时器时长，6秒一轮播
    _defineProperty(_assertThisInitialized(_this), "timerDuration", 6000);
    // 自动轮播
    _defineProperty(_assertThisInitialized(_this), "timer", null);
    // 是否刚刚手动滑动
    _defineProperty(_assertThisInitialized(_this), "justSwipe", false);
    // 控制进入防抖的异步touchmove事件是否执行
    _defineProperty(_assertThisInitialized(_this), "end", false);
    // 当前滑动到的相对width的倍数 / 单位
    _defineProperty(_assertThisInitialized(_this), "n", 1);
    // 容器
    _defineProperty(_assertThisInitialized(_this), "wrapper", /*#__PURE__*/React.createRef());
    // slide个数
    _defineProperty(_assertThisInitialized(_this), "total", void 0);
    // 当前播放的slide位置
    _defineProperty(_assertThisInitialized(_this), "cur", 0);
    // 当前播放的slideのindex序号
    _defineProperty(_assertThisInitialized(_this), "slideIndex", 0);
    // 当前translate位置
    _defineProperty(_assertThisInitialized(_this), "translateVal", 0);
    // 当前translate累计移动，一般用于计算拖动的距离
    _defineProperty(_assertThisInitialized(_this), "translateCalVal", 0);
    return _this;
  }
  _createClass(Slide, [{
    key: "init",
    value:
    // 初始化
    function init() {
      var _this$props, _this$props2;
      this.total = (_this$props = this.props) === null || _this$props === void 0 || (_this$props = _this$props.children) === null || _this$props === void 0 ? void 0 : _this$props.length; // slide个数
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
      if ((_this$props2 = this.props) !== null && _this$props2 !== void 0 && (_this$props2 = _this$props2.option) !== null && _this$props2 !== void 0 && _this$props2.loop) {
        this.interval();
      }
    }
    // 卸载
  }, {
    key: "unmount",
    value: function unmount() {
      var _this$timer, _this$timer$pause, _this$timer2, _this$timer2$cancel;
      (_this$timer = this.timer) === null || _this$timer === void 0 || (_this$timer$pause = _this$timer.pause) === null || _this$timer$pause === void 0 || _this$timer$pause.call(_this$timer);
      (_this$timer2 = this.timer) === null || _this$timer2 === void 0 || (_this$timer2$cancel = _this$timer2.cancel) === null || _this$timer2$cancel === void 0 || _this$timer2$cancel.call(_this$timer2);
      this.timer = null;
      EventBus.off(MOVING);
      EventBus.off(MOVINGEND);
      EventBus.off(MOVINGSTART);
    }
    // 重新设定width、height
  }, {
    key: "resetSize",
    value: function resetSize() {
      var clientWd = 0;
      // let clientHg = 0;
      var _ref = this.wrapper.current || document.body,
        clientWidth = _ref.clientWidth;
      clientWd = clientWidth || document.body.clientWidth;
      // clientHg = clientHeight || document.body.clientHeight;
      this.width = clientWd;
      // this.height = clientHg;
    }
    // 触摸开始
  }, {
    key: "onPressStart",
    value: function onPressStart() {
      if (this.timer) {
        var _this$timer3;
        (_this$timer3 = this.timer) === null || _this$timer3 === void 0 || _this$timer3.pause();
      }
      this.backOrigin();
      this.end = false;
    }
    // 触摸移动
  }, {
    key: "onPressMove",
    value: function onPressMove(props) {
      if (this.end) return;
      var _ref2 = props || {},
        deltaX = _ref2.deltaX,
        direction = _ref2.direction,
        distance = _ref2.distance;
      this.dragAction(deltaX);
      // 处理禁用一些默认行为
      // stopEvent(props?.event);
      this.beforeSwipe(distance, direction);
    }
    // 触摸结束
  }, {
    key: "onPressEnd",
    value: function onPressEnd(props) {
      this.end = true;
      var wrapper = this.wrapper;
      // 错误处理
      if (!wrapper.current) {
        return;
      }
      this.wrapper.current.style.transition = 'transform .5s';
      if ((props === null || props === void 0 ? void 0 : props.direction) === NOCHANGE) {
        this.translateCalVal = 0;
        myTransLateX(wrapper.current, this.translateVal);
      } else if ((props === null || props === void 0 ? void 0 : props.direction) === LEFT) {
        this.swipeTo(LEFT);
      } else if ((props === null || props === void 0 ? void 0 : props.direction) === RIGHT) {
        this.swipeTo(RIGHT);
      }
      this.reset();
      this.justSwipe = true;
      if (this.timer) {
        var _this$timer4, _this$timer4$start;
        (_this$timer4 = this.timer) === null || _this$timer4 === void 0 || (_this$timer4$start = _this$timer4.start) === null || _this$timer4$start === void 0 || _this$timer4$start.call(_this$timer4); // 重新开始自动轮播
      }
    }
    // 拖动效果
  }, {
    key: "dragAction",
    value: function dragAction(deltaX) {
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
  }, {
    key: "handleMoveIndex",
    value: function handleMoveIndex(index, distance, isMoveWill, direction) {
      var total = this.total,
        wrapper = this.wrapper,
        width = this.width;
      var needToTranslateIndex = index;
      // 错误处理
      if (!total || total < 1 || !wrapper.current) {
        return;
      }
      // 在正常范围
      if (needToTranslateIndex >= 0 && needToTranslateIndex <= total - 1) {
        var _wrapper$current;
        myTransLateX((_wrapper$current = wrapper.current) === null || _wrapper$current === void 0 ? void 0 : _wrapper$current.children[index], 0);
      } else if (direction === RIGHT) {
        var _wrapper$current2;
        // 需要translate的slide下标
        needToTranslateIndex = (total - Math.abs(index) % total) % total;
        var originIndex = isMoveWill ? this.slideIndex : this.slideIndex + 1;
        // 需要translate的长度
        var len = Math.floor((distance - originIndex * width) / (total * width)) + 1;
        myTransLateX((_wrapper$current2 = wrapper.current) === null || _wrapper$current2 === void 0 ? void 0 : _wrapper$current2.children[needToTranslateIndex], -total * width * len);
      } else {
        // 需要translate的slide下标
        needToTranslateIndex = index % total;
        var _originIndex = isMoveWill ? total - 1 - this.slideIndex : total - this.slideIndex;
        // 需要translate的长度
        var _len2 = Math.floor((distance - _originIndex * width) / (total * width)) + 1;
        myTransLateX(wrapper.current.children[needToTranslateIndex], total * width * _len2);
      }
    }
    // 滑动前置处理
  }, {
    key: "beforeSwipe",
    value: function beforeSwipe(distance, direction) {
      var width = this.width;
      var n = Math.floor(distance / width); // 当前滑动到的相对width的倍数 / 单位
      // 左滑
      if (direction === LEFT) {
        var moveWill = this.cur + n + 1; // touchMove，移动中将要到达的slide的位置
        var moveOrigin = this.cur + n; // touchMove，移动中原来的slide的位置
        this.handleMoveIndex(moveWill, distance, true, LEFT);
        this.handleMoveIndex(moveOrigin, distance, false, LEFT);
      }
      // 右滑
      if (direction === RIGHT) {
        var _moveWill = this.cur - n - 1; // touchMove，移动中将要到达的slide的位置
        var _moveOrigin = this.cur - n; // touchMove，移动中原来的slide的位置
        this.handleMoveIndex(_moveWill, distance, true, RIGHT);
        this.handleMoveIndex(_moveOrigin, distance, false, RIGHT);
      }
      if (n > 0) {
        // 改成四舍五入
        this.n = Math.round(distance / width);
      } else {
        this.n = 1;
      }
    }
    // 处理this.cur,让所有挂件回到原来的的位置
  }, {
    key: "backOrigin",
    value: function backOrigin() {
      var wrapper = this.wrapper,
        width = this.width,
        total = this.total,
        slideIndex = this.slideIndex;
      // 过滤掉出问题的地方
      if (!(wrapper !== null && wrapper !== void 0 && wrapper.current) || !total || !Array.isArray(this.props.children)) return;
      // 取消动画的过渡时间，让拖动恢复正常
      wrapper.current.style.transition = '';
      // 当前cur转换成slideIndex
      this.cur = slideIndex;
      // 轮播子元素回归原位
      for (var i = 0; i < total; i++) {
        var _this$wrapper$current;
        myTransLateX((_this$wrapper$current = this.wrapper.current) === null || _this$wrapper$current === void 0 ? void 0 : _this$wrapper$current.children[i], 0);
      }
      // 轮播容器回归当前slideIndex对应位置
      myTransLateX(wrapper.current, slideIndex * -width);
      // 重要的一步：根据当前slideIndex重制translateVal的值
      this.translateVal = -slideIndex * width;
    }
    // 从cur位置切换至next位置
  }, {
    key: "swipeTo",
    value: function swipeTo(direction) {
      var wrapper = this.wrapper,
        width = this.width,
        total = this.total;
      this.cur = direction === RIGHT ? this.cur - this.n : this.cur + this.n;
      // 错误处理
      if (!total || total < 1 || !wrapper.current) {
        return;
      }
      if (this.cur < 0) {
        // 指向当前滑动到的slide序号。且保证slideIndex为正确的下标，不为负数
        this.slideIndex = (total - Math.abs(this.cur) % total) % total;
      } else {
        this.slideIndex = this.cur % total;
      }
      this.translateCalVal = direction === RIGHT ? width * this.n : -width * this.n;
      this.translateVal += this.translateCalVal;
      myTransLateX(wrapper.current, this.translateVal);
    }
    // 重置操作
  }, {
    key: "reset",
    value: function reset() {
      this.translateCalVal = 0;
      this.n = 1;
    }
    // 自动轮播其实就是走一遍滑动的流程
  }, {
    key: "interval",
    value: function interval() {
      var _this2 = this;
      if (!this.wrapper.current) {
        return;
      }
      this.timer = requestAnimation(function () {
        _this2.backOrigin();
        // 刚刚滑动过，先不轮播
        if (_this2.justSwipe) {
          _this2.justSwipe = false;
        } else {
          sleep().then(function () {
            // 放在异步是为了让css和js动画能按顺序执行和渲染
            // 模拟左滑
            _this2.beforeSwipe(1, LEFT);
            _this2.wrapper.current.style.transition = 'transform .5s';
            _this2.swipeTo(LEFT);
            _this2.reset();
          });
        }
      }, this.timerDuration);
    }
    // 轮播到上一个
  }, {
    key: "swipeToPre",
    value: function swipeToPre() {
      var _this3 = this;
      this.backOrigin();
      sleep().then(function () {
        // 放在异步是为了让css和js动画能按顺序执行和渲染
        _this3.beforeSwipe(1, RIGHT);
        _this3.wrapper.current.style.transition = 'transform .5s';
        _this3.swipeTo(RIGHT);
        _this3.reset();
      });
    }
    // 轮播到下一个
  }, {
    key: "swipeToNext",
    value: function swipeToNext() {
      var _this4 = this;
      this.backOrigin();
      sleep().then(function () {
        // 放在异步是为了让css和js动画能按顺序执行和渲染
        _this4.beforeSwipe(1, LEFT);
        _this4.wrapper.current.style.transition = 'transform .5s';
        _this4.swipeTo(LEFT);
        _this4.reset();
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.init();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmount();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3, _this$props4;
      return /*#__PURE__*/React.createElement("div", {
        className: (_this$props3 = this.props) !== null && _this$props3 !== void 0 && _this$props3.className ? "basic-slide ".concat((_this$props4 = this.props) === null || _this$props4 === void 0 ? void 0 : _this$props4.className) : 'basic-slide'
      }, /*#__PURE__*/React.createElement("div", {
        className: "basic-slide-wrapper",
        ref: this.wrapper
      }, this.props.children));
    }
  }]);
  return Slide;
}(React.PureComponent);

exports.default = Slide;
