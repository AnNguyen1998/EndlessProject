const Emitter = require("Emitter");
const { Game : GameEventKeys } = require('EventKeys');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
        this.init();
    },

    init() {
            let checkClear = this.node.getChildByName("IconLock").active;
            if (!checkClear) {
                this.node.on(GameEventKeys.CLICK_CHAPTER, this.onClickChapter, this);
            }
    },

    onClickChapter() {
        console.log("Chapter clicked: " + this.node.getChildByName("Level").getComponent(cc.Label).string);
        
        Emitter.instance.emit(GameEventKeys.SCENE_CHANGE, "Room");
        Emitter.instance.emit(GameEventKeys.SELECT_CHAPTER, this.node.getChildByName("Level").getComponent(cc.Label).string);
    },

    onDestroy() {
        this.node.off(GameEventKeys.CLICK_CHAPTER, this.onClickChapter, this);
    }

});
