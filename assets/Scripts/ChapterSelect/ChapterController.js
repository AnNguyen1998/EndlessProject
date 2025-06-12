const Emitter = require('Emitter')
const { Game } = require('EventKeys')
const PlayerData = require('PlayerTemplate')
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
        this.registerEventsMap();
    },

    init() {
        this.eventMap = {
            [Game.CHAPTER_FINISH]: this.saveChapterFinish.bind(this),
        }
        PlayerData.load(); //TODO: clear
        for (let i = 0; i < 100; i++) {
            const chapterNumber = i + 1;
            const chapter = cc.instantiate(this.chapterPreFabs);
            const levelLabel = chapter.getChildByName("Level").getComponent(cc.Label);
            levelLabel.string = chapterNumber;
            const iconLock = chapter.getChildByName("IconLock");
            const starContainer = chapter.getChildByName("StarContainer");
            const isUnlocked = PlayerData.isChapterUnlocked(chapterNumber) || chapterNumber === 1;
            iconLock.active = !isUnlocked;
            chapter.color = isUnlocked ? new cc.Color().fromHEX("#CE7504") : cc.Color.GRAY;
            if (isUnlocked && starContainer) {
                const starCount = PlayerData.getChapterStar(chapterNumber);
                for (let s = 0; s < 3; s++) {
                    const starNode = starContainer.getChildByName(`Star${s + 1}`);
                    starNode.color = s < starCount ? cc.Color.YELLOW : cc.Color.BLACK;
                }
            }
            this.chapterList.push(chapter);
            this.layout.node.addChild(chapter);
        }
        this.scrollView.scrollToTop(0);
    },

    registerEvent() {
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    saveChapterFinish(chapterFinish) {
        PlayerData.setChapterStar(chapterFinish.chapterNumber, chapterFinish.starsEarned);
        PlayerData.unlockNextChapter(chapterFinish.chapterNumber);
        PlayerData.save();
    },

    onClickButtonBack() {
        Emitter.instance.emit(Game.SCENE_CHANGE, "Lobby");
    },

    onDestroy() {
        this.chapterList = null;
    }

});
