const { Player: PlayerEventKeys } = require('EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        upButton: cc.Node,
        downButton: cc.Node,
        shootButton: cc.Node,
        isMovingUp: false,
        isMovingDown: false,
        isShoot: false,
    },

    init() {
        this.registerInputEvents();
    },

    registerInputEvents() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.upButton) {
            this.upButton.on(cc.Node.EventType.TOUCH_START, this.onUpButtonDown, this);
            this.upButton.on(cc.Node.EventType.TOUCH_END, this.onUpButtonUp, this);
            this.upButton.on(cc.Node.EventType.TOUCH_CANCEL, this.onUpButtonUp, this);
        }

        if (this.downButton) {
            this.downButton.on(cc.Node.EventType.TOUCH_START, this.onDownButtonDown, this);
            this.downButton.on(cc.Node.EventType.TOUCH_END, this.onDownButtonUp, this);
            this.downButton.on(cc.Node.EventType.TOUCH_CANCEL, this.onDownButtonUp, this);
        }

        if (this.shootButton) {
            this.shootButton.on(cc.Node.EventType.TOUCH_START, this.onShootButtonDown, this);
            this.shootButton.on(cc.Node.EventType.TOUCH_END, this.onShootButtonUp, this);
            this.shootButton.on(cc.Node.EventType.TOUCH_CANCEL, this.onShootButtonUp, this);
        }

        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.parent.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.parent.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
                this.isMovingUp = true;
                cc.systemEvent.emit(PlayerEventKeys.MOVE_UP, true);
                break;
            case cc.macro.KEY.down:
                this.isMovingDown = true;
                cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN, true);
                break;
            case cc.macro.KEY.space:
                this.isShoot = true;
                cc.systemEvent.emit(PlayerEventKeys.SHOOT);
                break;
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
                this.isMovingUp = false;
                cc.systemEvent.emit(PlayerEventKeys.MOVE_UP, false);
                break;
            case cc.macro.KEY.down:
                this.isMovingDown = false;
                cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN, false);
                break;
            case cc.macro.KEY.space:
                this.isShoot = false;
                break;
        }
    },

    onUpButtonDown() {
        this.isMovingUp = true;
        cc.systemEvent.emit(PlayerEventKeys.MOVE_UP, true);
    },

    onUpButtonUp() {
        this.isMovingUp = false;
        cc.systemEvent.emit(PlayerEventKeys.MOVE_UP, false);
    },

    onDownButtonDown() {
        this.isMovingDown = true;
        cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN, true);
    },

    onDownButtonUp() {
        this.isMovingDown = false;
        cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN, false);
    },

    onShootButtonDown() {
        if (!this.isShoot) {
            this.isShoot = true;
            cc.systemEvent.emit(PlayerEventKeys.SHOOT);
        }
    },

    onShootButtonUp() {
        this.isShoot = false;
    },

    getIsMovingUp() {
        return this.isMovingUp;
    },

    getIsMovingDown() {
        return this.isMovingDown;
    },

    getIsShooting() {
        return this.isShoot;
    },

    unregisterInputEvents() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.upButton) {
            this.upButton.off(cc.Node.EventType.TOUCH_START, this.onUpButtonDown, this);
            this.upButton.off(cc.Node.EventType.TOUCH_END, this.onUpButtonUp, this);
            this.upButton.off(cc.Node.EventType.TOUCH_CANCEL, this.onUpButtonUp, this);
        }

        if (this.downButton) {
            this.downButton.off(cc.Node.EventType.TOUCH_START, this.onDownButtonDown, this);
            this.downButton.off(cc.Node.EventType.TOUCH_END, this.onDownButtonUp, this);
            this.downButton.off(cc.Node.EventType.TOUCH_CANCEL, this.onDownButtonUp, this);
        }

        if (this.shootButton) {
            this.shootButton.off(cc.Node.EventType.TOUCH_START, this.onShootButtonDown, this);
            this.shootButton.off(cc.Node.EventType.TOUCH_END, this.onShootButtonUp, this);
            this.shootButton.off(cc.Node.EventType.TOUCH_CANCEL, this.onShootButtonUp, this);
        }

        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.parent.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.parent.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
    },

    onDestroy() {
        this.unregisterInputEvents();
    },

});