const Emitter = require("Emitter");
const { Game: GameEventKeys } = require('EventKeys');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.init();
    },

    init() {
        const isLocked = this.node.getChildByName("IconLock").active;
        if (!isLocked) {
            this.node.on(GameEventKeys.CLICK_CHAPTER, this.onClickChapter, this);
        }
    },

    onClickChapter() {
        Emitter.instance.emit(GameEventKeys.SCENE_CHANGE, "Room");
        Emitter.instance.emit(GameEventKeys.SELECT_CHAPTER, this.node.getChildByName("Level").getComponent(cc.Label).string);
    },

    onDestroy() {
        this.node.off(GameEventKeys.CLICK_CHAPTER, this.onClickChapter, this);
    }

});
