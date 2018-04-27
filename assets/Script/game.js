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
        },
        speed: 5,
        obj: {
            default: null 
        },
        isMove: false
    },

    onLoad() {
        this._initTouchEvent();
    },

    _initTouchEvent() {
        var self = this;
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
            self._touchEndEvent(event);
        });
    },

    _touchStartEvent(event) {
        // 以圆圈为坐标系获取触摸坐标
        var touchPos = this.ring.convertToNodeSpaceAR(event.currentTouch._point);
        // 更改摇杆的位置
        // var act = cc.moveTo(0.1, touchPos);
        // this.dot.runAction(act);
        this.dot.setPosition(touchPos);
        var obj = this.computeRotation(touchPos);
        this.isMove = true;
    },

    _touchMoveEvent(event) {
        var touchPos = this.ring.convertToNodeSpaceAR(event.currentTouch._point);
        var distance = cc.pDistance(touchPos, cc.p(0, 0));
        var radius = this.ring.width / 2;

        var obj = this.computeRotation(touchPos);
        if (distance < radius) {
            this.dot.setPosition(touchPos);
        } else {
            // 控杆永远保持在圈内，并在圈内跟随触摸更新角度
            var x = radius * Math.sin(obj.radian);
            var y = radius * Math.cos(obj.radian);
            if (touchPos.y > 0) {
                this.dot.setPosition(x, y);
            } else {
                this.dot.setPosition(-x, -y);
            }
        }
        this.isMove = true;
    },

    _touchEndEvent(event) {
        this.dot.setPosition(0, 0);
        this.isMove = false;
    },

    computeRotation(touchPos) {
        var obj = {}
        // 在 touchPos.y === 0，即水平轴时，会出现一个异常显示
        obj.radian = Math.atan(touchPos.x / touchPos.y);
        obj.rotation = (180 * obj.radian / Math.PI + 90) % 360;
        if (touchPos.y < 0) {
            obj.rotation = -obj.rotation;
        } else {
            obj.rotation = 180 - obj.rotation;
        }
        this.obj = obj;
        return obj;
    },

    moveDot(obj) {
        if (obj.rotation >= 0) {
            // 一、二象限
            this.player.x += this.speed * Math.sin(obj.radian);
            this.player.y += this.speed * Math.cos(obj.radian);
        } else {
            // 三、四象限
            this.player.x -= this.speed * Math.sin(obj.radian);
            this.player.y -= this.speed * Math.cos(obj.radian);
        }
    },

    update(dt) {
        if (this.isMove) {
            this.moveDot(this.obj);
        }
    }
});
