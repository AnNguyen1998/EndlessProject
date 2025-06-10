const { Player: PlayerEventKeys } = require('EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        upButton: cc.Node,
        downButton: cc.Node,
        shootButton: cc.Node,
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
                cc.systemEvent.emit(PlayerEventKeys.MOVE_UP);
                break;
            case cc.macro.KEY.down:
                cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN);
                break;
            case cc.macro.KEY.space:
                cc.systemEvent.emit(PlayerEventKeys.SHOOT);
                break;
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
                cc.systemEvent.emit(PlayerEventKeys.MOVE_UP);
                break;
            case cc.macro.KEY.down:
                cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN);
                break;
            case cc.macro.KEY.space:
                cc.systemEvent.emit(PlayerEventKeys.SHOOT);
                break;
        }
    },

    onUpButtonDown() {
        cc.systemEvent.emit(PlayerEventKeys.MOVE_UP);
    },

    onUpButtonUp() {
        cc.systemEvent.emit(PlayerEventKeys.MOVE_UP);
    },

    onDownButtonDown() {
        cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN);
    },

    onDownButtonUp() {
        cc.systemEvent.emit(PlayerEventKeys.MOVE_DOWN);
    },

    onShootButtonDown() {
            cc.systemEvent.emit(PlayerEventKeys.SHOOT);
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