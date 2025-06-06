const Emitter = require('Emitter');
const EventKey = require('EventKeys');
cc.Class({
    extends: cc.Component,

    onLoad() {
        this.registerEvents();
    },

    registerEvents() {
        Emitter.instance.registerEvent(EventKey.SCENE_CHANGE, this.onSceneChange.bind(this));
    },

    onSceneChange(nameScene) {
        cc.director.loadScene(nameScene);
    },

    onDestroy() {
        Emitter.instance.removeEvent(EventKey.SCENE_CHANGE, this.onSceneChange.bind(this));
    },

});
