cc.Class({
    extends: cc.Component,

    properties: {
        dot: {
            default: null,
            type: cc.Node
        },
        ring: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this._initTouchEvent();
    },

    _initTouchEvent () {
        let self = this;
        self.dot.on('touchstart', function (event) {
            self._touchStartEvent(event);
        });
        self.dot.on('touchmove', function (event) {
            self._touchMoveEvent(event);
        });
        self.dot.on('touchend', function (event) {
            self._touchEndEvent(event);
        });
        self.dot.on('touchcancel', function (event) {
            self._touchCancelEvent(event);
        });
    },

    _touchStartEvent (event) {
        cc.log(event);

        // 记录触摸的世界坐标，给touch move使用
        let touchPos = this.ring.convertToNodeSpaceAR(event.currentTouch._point);
        // let touchPos = event.currentTouch._point; 
        cc.log('touchPos = ' + touchPos)
        // 更改摇杆的位置
        let act = cc.moveTo(0.1, touchPos);
        this.dot.runAction(act);
        // 记录摇杆位置，给touch move使用
        this._stickPos = touchPos;
    },

    _touchMoveEvent (event) {},
    _touchEndEvent (event) {},
    _touchCancelEvent (event) {}
});
