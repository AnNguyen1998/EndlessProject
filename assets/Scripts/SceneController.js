const Emitter = require('Emitter');
const { Game: GameEventKeys } = require('EventKeys');
cc.Class({
    extends: cc.Component,


    init() {
        this.eventMaps = {
            [GameEventKeys.SCENE_CHANGE]: this.onSceneChange.bind(this),
        };
        this.registerEvents();
        cc.log("SceneController initialized");
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
