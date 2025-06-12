
const Emitter = require("Emitter");
const { Game: GameEventKeys } = require('EventKeys');
const LocalStorageUnit = require("LocalStorageUnit");
const LocalStorageKeys = require("LocalStorageKeys");
const SoundKeys = require("SoundKeys");
cc.Class({
    extends: cc.Component,

    properties: {
        popupController: {
            default: null,
            type: require("PopupController"),
        },
        sceneController: {
            default: null,
            type: require("SceneController"),
        },
        sounnController: {
            default: null,
            type: require("SoundController"),
        },
    },

    onLoad() {
        this.init();
    },
    init() {
        this.eventMap = {
            [GameEventKeys.END_GAME]: this.onDestroy.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
        cc.game.addPersistRootNode(this.node);
        cc.game.addPersistRootNode(this.popupController.node);
        cc.game.addPersistRootNode(this.sceneController.node);
        this.node.active = false;
        this.popupController.init();
        this.sceneController.init();
        this.sounnController.init();
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
        this.popupController.removeEventsMap();
        this.sceneController.removeEventsMap();
        cc.game.removePersistRootNode(this.node);
        cc.game.removePersistRootNode(this.popupController.node);
        cc.game.removePersistRootNode(this.sceneController.node);
        LocalStorageUnit.setItem(LocalStorageKeys.SOUND, SoundKeys.ON);
        LocalStorageUnit.setItem(LocalStorageKeys.MUSIC, SoundKeys.ON);
        Emitter.instance.emit(GameEventKeys.CLICK_SOUND);
        Emitter.instance.emit(GameEventKeys.CLICK_MUSIC);
        Emitter.instance.emit(GameEventKeys.REMOVE_ALL_POPUPS);
        Emitter.instance.emit(GameEventKeys.REMOVE_ALL_SCENES);
        Emitter.instance.emit(GameEventKeys.REMOVE_ALL_CHAPTERS);
    },
    onSceneChange(sceneName) {
        if (sceneName === "Game") {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    },
    onClickButtonBack() {
        Emitter.instance.emit(GameEventKeys.SCENE_CHANGE, "Lobby");
    },
    onClickButtonChapter() {
        Emitter.instance.emit(GameEventKeys.SCENE_CHANGE, "ChapterSelect");
    },
    onClickButtonSetting() {
        Emitter.instance.emit(GameEventKeys.SHOW_SETTING_POPUP);
    },
    onClickButtonUpgrade() {
        Emitter.instance.emit(GameEventKeys.SHOW_UPGRADE_POPUP);
    },
    onClickButtonTutorial() {
        Emitter.instance.emit(GameEventKeys.SHOW_TUTORIAL_POPUP);
    },
    onClickButtonSound() {
        Emitter.instance.emit(GameEventKeys.CLICK_SOUND);
    },


});
