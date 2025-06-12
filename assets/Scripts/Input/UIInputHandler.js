const Emitter = require('../EventEmitter/Emitter');
const { Player: PlayerEventKeys } = require('../EventEmitter/EventKeys');
const InputController = require('./InputController');

cc.Class({
    extends: cc.Component,

    properties: {
        upButton: cc.Button,
        downButton: cc.Button,
        shootButton: cc.Button,
    },

    onLoad() {
        this.init();
    },

    init() {
        if (!InputController.instance) {
            InputController.instance = new InputController();
            InputController.instance.init();
        }

        this.registerUIButtons();
        console.log('UIInputHandler initialized with buttons');
    },

    registerUIButtons() {
        if (this.upButton) {
            this.upButton.node.on('click', this.onUpButtonClick, this);
        }
        if (this.downButton) {
            this.downButton.node.on('click', this.onDownButtonClick, this);
        }
        if (this.shootButton) {
            this.shootButton.node.on('click', this.onShootButtonClick, this);
        }
    },

    // unregisterUIButtons() {
    //     if (this.upButton) {
    //         this.upButton.node.off('click', this.onUpButtonClick, this);
    //     }
    //     if (this.downButton) {
    //         this.downButton.node.off('click', this.onDownButtonClick, this);
    //     }
    //     if (this.shootButton) {
    //         this.shootButton.node.off('click', this.onShootButtonClick, this);
    //     }
    // },

    onUpButtonClick() {
        console.log('Up button clicked - emitting MOVE_UP');
        Emitter.instance.emit(PlayerEventKeys.MOVE_UP);
    },

    onDownButtonClick() {
        console.log('Down button clicked - emitting MOVE_DOWN');
        Emitter.instance.emit(PlayerEventKeys.MOVE_DOWN);
    },

    onShootButtonClick() {
        console.log('Shoot button clicked - emitting PRE_SHOOT');
        Emitter.instance.emit(PlayerEventKeys.PRE_SHOOT);
    },

    onDestroy() {
        // this.unregisterUIButtons();
        console.log('UIInputHandler destroyed');
    }
});

