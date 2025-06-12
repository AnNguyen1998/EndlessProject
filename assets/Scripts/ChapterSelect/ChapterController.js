const Emitter = require('Emitter')
const { Game } = require('EventKeys')
cc.Class({
    extends: cc.Component,

    properties: {
        chapterPreFabs: {
            default: null,
            type: cc.Prefab,
        },
        chapterList: {
            default: [],
            type: cc.Node,
        },
        layout: {
            default: null,
            type: cc.Layout,
        },
        scrollView: {
            default: null,
            type: cc.ScrollView,
        },
    },

    onLoad() {
        this.init();
    },

    init() {
        for (let i = 0; i < 12; i++) {
            let chapter = cc.instantiate(this.chapterPreFabs);
            chapter.getChildByName("Level").getComponent(cc.Label).string = (i + 1);
            if(i == 0) {
                chapter.getChildByName("IconLock").active = false;
                chapter.color = new cc.Color().fromHEX("#CE7504");
            }
            this.chapterList.push(chapter);
            this.layout.node.addChild(chapter);
        }
        this.scrollView.scrollToTop(0);
    },

    onClickButtonBack() {
        Emitter.instance.emit(Game.SCENE_CHANGE, "Lobby");
    }

});
