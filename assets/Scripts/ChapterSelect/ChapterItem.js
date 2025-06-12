const Emitter = require("Emitter");
const { Game: GameEventKeys } = require('EventKeys');
const GameData = require('GameData'); 
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
            this.node.on('click', this.onClickChapter, this);
        }
    },

    onClickChapter() {
        const chapterNumber = this.node.getChildByName("Level").getComponent(cc.Label).string;
        GameData.selectedChapter = chapterNumber;
        Emitter.instance.emit(GameEventKeys.SCENE_CHANGE, "Room");
        Emitter.instance.emit(GameEventKeys.SELECT_CHAPTER, this.node.getChildByName("Level").getComponent(cc.Label).string);
    },

    onDestroy() {
        this.node.off(GameEventKeys.CLICK_CHAPTER, this.onClickChapter, this);
    }

});
