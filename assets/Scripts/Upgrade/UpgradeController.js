const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const LocalStorageUnit = require('LocalStorageUnit');

cc.Class({
    extends: cc.Component,
    
    onLoad() {
        this.init();
        this.registerEvents();
    },

    init() {
        this.eventMap = {
            [PlayerEventKeys.UPGRADE_STAT]: this.handleUpgradeStat.bind(this),
        };
    },

    registerEvents() {
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    handleUpgradeStat(attributeNode) {
        console.log(attributeNode,"dang o upgradecontroller");
    },

    removeEvents() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    onDestroy() {
        this.removeEvents();
    }
});