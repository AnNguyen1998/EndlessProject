const Emitter = require('Emitter');
const { Game : GameEventKeys } = require('EventKeys');
cc.Class({
    extends: cc.Component,

    onLoad() {
        this.registerEvents();
    },

    registerEvents() {
        Emitter.instance.registerEvent(GameEventKeys.SCENE_CHANGE, this.onSceneChange.bind(this));
    },

    onSceneChange(nameScene) {
        cc.director.loadScene(nameScene);
    },

    onDestroy() {
        Emitter.instance.removeEvent(GameEventKeys.SCENE_CHANGE, this.onSceneChange.bind(this));
    },

});
