const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
cc.Class ({
    extends: cc.Component,

    properties: {
       
    },

    onLoad() {
       this.init();
       this.registerEvents();
    },

    init() {
        this.eventMap = {
            [PlayerEventKeys.UPGRADE_STAT]: this.onUpgradeStat.bind(this),
        };
    },

    registerEvents() {
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onUpgradeStat(title) {
        
    },

    removeEvents() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    onDestroy() {
        this.removeEvents();
    }

})