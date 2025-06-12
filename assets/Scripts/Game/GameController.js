const Emitter = require("Emitter");
const { Game: GameEventKeys } = require('EventKeys');
const LocalStorageUnit = require("LocalStorageUnit");
const LocalStorageKeys = require("LocalStorageKeys");
const SoundKeys = require("SoundKeys");
const PlayerData = require('PlayerTemplate');
const GameStateMachine = require('./GameStateMachine');
const GameTransition = require('./GameTransition');

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
        soundController: {
            default: null,
            type: require("SoundController"),
        }
    },

    onLoad() {
        if (!this.fsm) {
            this.fsm = GameStateMachine.createStateMachine(this);
        }

        if (this.fsm.can(GameTransition.INITIALIZE)) {
            this.fsm.initialize();
        }
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    performInit() {
        console.log("performInit GameController");
        PlayerData.load();
        cc.game.addPersistRootNode(this.node);
        cc.game.addPersistRootNode(this.popupController.node);
        cc.game.addPersistRootNode(this.sceneController.node);
        cc.game.addPersistRootNode(this.soundController.node);
        this.sceneController.init();
        this.popupController.init();
        this.soundController.init();
        this.node.active = false;
        this.eventMap = {
            [GameEventKeys.END_GAME]: this.triggerEndGame.bind(this),
            [GameEventKeys.SCENE_CHANGED]: this.onSceneChange.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    triggerEndGame() {
        if (this.fsm.can(GameTransition.END)) {
            this.fsm.end();
        }
    },

    performEnd() {
        cc.game.removePersistRootNode(this.node);
        cc.game.removePersistRootNode(this.popupController.node);
        cc.game.removePersistRootNode(this.sceneController.node);
        cc.game.removePersistRootNode(this.soundController.node);

        Emitter.instance.emit(GameEventKeys.CLICK_SOUND);
        Emitter.instance.emit(GameEventKeys.CLICK_MUSIC);
        Emitter.instance.emit(GameEventKeys.REMOVE_ALL_POPUPS);
        Emitter.instance.emit(GameEventKeys.REMOVE_ALL_SCENES);
        Emitter.instance.emit(GameEventKeys.REMOVE_ALL_CHAPTERS);
        cc.director.loadScene("Portal");
    },

    onSceneChange(sceneName) {
        this.node.active = (sceneName === "Game");
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