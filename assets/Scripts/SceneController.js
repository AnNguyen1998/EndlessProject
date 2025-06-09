const Emitter = require('Emitter');
const { Game: GameEventKeys } = require('EventKeys');
cc.Class({
    extends: cc.Component,

    onLoad() {
        this.init();
        this.registerEvents();
    },

    init() {
        this.eventMaps = {
            [GameEventKeys.SCENE_CHANGE]: this.onSceneChange.bind(this),
        };
    },

    registerEvents() {
        Emitter.instance.registerEventsMap(this.eventMaps);

    },

    onSceneChange(nameScene) {
        cc.director.loadScene(nameScene);
    },

    removeEventsMap() {
        Emitter.instance.removeEventsMap(this.eventMaps);
    },

    onDestroy() {
        this.removeEventsMap();
    },

});
