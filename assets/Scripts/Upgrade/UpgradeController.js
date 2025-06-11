const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const LocalStorageUnit = require('LocalStorageUnit');
const PlayerAttributeTemplate = require('PlayerAttributeTemplate');

cc.Class({
    extends: cc.Component,

    properties: {
        attributeJsonAsset: cc.JsonAsset,
        _playerAttribute: null,
        _attributeConfig: null,
        playerGold: {
            default: null,
            type: cc.Label
        }
    },

    onLoad() {
        this.init();
    },

    init() {
        this.eventMap = {
            [PlayerEventKeys.REQUEST_UPGRADE]: this.handleUpgradeStat.bind(this),
            [PlayerEventKeys.REQUEST_ATTRIBUTE_DATA]: this.provideAttributeData.bind(this),
            [PlayerEventKeys.REQUEST_UPGRADE_INFO]: this.provideUpgradeInfo.bind(this),
            [PlayerEventKeys.REQUEST_UPGRADE_DISPLAY_DATA]: this.getUpgradeDisplayData.bind(this),
        }
        this._attributeConfig = this.attributeJsonAsset.json;
        this.loadPlayerAttribute();
        this.loadPlayerGold();
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEvent(this.eventMap);
    },

    loadPlayerAttribute() {
        const savedData = LocalStorageUnit.get("PlayerAttribute");
        this._playerAttribute = Object.create(PlayerAttributeTemplate);
        if (savedData) {
            this._playerAttribute = savedData;
        } else {
            const attributes = this._attributeConfig.attributes;
            for (const attr of attributes) {
                this._playerAttribute[attr.name] = {
                    value: attr.defaultAttribute,
                    level: 1
                };
            }
            this.savePlayerAttribute();
        }
    },

    savePlayerAttribute() {
        LocalStorageUnit.set("PlayerAttribute", this._playerAttribute);
    },

    provideAttributeData(attributeName, callback) {
        if (typeof callback === 'function') {
            callback(this._playerAttribute[attributeName]);
        }
    },

    provideUpgradeInfo(attributeName, currentLevel, callback) {
        const factory = this._attributeConfig.attributes_factory.find(f => f.name === attributeName);
        if (!factory) {
            if (typeof callback === 'function') callback(null);
            return;
        }
        const upgradeInfo = factory.factory.find(f => f.level === currentLevel + 1) || null;
        if (typeof callback === 'function') callback(upgradeInfo);
    },

    getUpgradeDisplayData(attributeName, callback) {
        const attrData = this._playerAttribute[attributeName];
        if (!attrData) {
            callback(null);
            return;
        }
        const currentValue = attrData.value;
        const currentLevel = attrData.level;
        const factory = this._attributeConfig.attributes_factory.find(f => f.name === attributeName);
        if (!factory) {
            callback(null);
            return;
        }
        const upgradeInfo = factory.factory.find(f => f.level === currentLevel + 1) || null;
        let nextValue = null;
        if (upgradeInfo) {
            if (upgradeInfo.hasOwnProperty('multiplier')) {
                nextValue = currentValue * upgradeInfo.multiplier;
            } else if (upgradeInfo.hasOwnProperty('bonus')) {
                nextValue = currentValue + upgradeInfo.bonus;
            }
        }
        const displayData = {
            currentValue,
            currentLevel,
            isMaxLevel: !upgradeInfo,
            upgradeInfo: upgradeInfo,
            nextValue,
            playerGold: parseInt(this.playerGold.string),
            canUpgrade: upgradeInfo ? parseInt(this.playerGold.string) >= upgradeInfo.price : false,
        };
        callback(displayData);
    },

    handleUpgradeStat(attributeName) {
        const currentAttrData = this._playerAttribute[attributeName];
        const upgradeInfo = this._attributeConfig.attributes_factory
            .find(f => f.name === attributeName)
            .factory.find(f => f.level === currentAttrData.level + 1);
        if (!upgradeInfo) {
            console.warn(`Cannot upgrade ${attributeName}: Max level reached or no upgrade info found.`);
            return;
        }
        const playerGold = parseInt(this.playerGold.string);
        const playerLevel = 50;
        const currentChapter = 10;
        if (playerGold < upgradeInfo.price) {
            console.log("Not enough gold!");
            return;
        }
        if (playerLevel < upgradeInfo.condition.required_player_level) {
            console.log("Player level not high enough!");
            return;
        }
        if (currentChapter < upgradeInfo.condition.chapter) {
            console.log("Need to reach a higher chapter!");
            return;
        }
        const newGold = playerGold - upgradeInfo.price;
        this.savePlayerGold();
        currentAttrData.level++;
        if (upgradeInfo.hasOwnProperty('multiplier')) {
            currentAttrData.value *= upgradeInfo.multiplier;
        } else if (upgradeInfo.hasOwnProperty('bonus')) {
            currentAttrData.value += upgradeInfo.bonus;
        }
        this.savePlayerAttribute();
        Emitter.instance.emit(PlayerEventKeys.UPDATE_PLAYER_GOLD_UI, newGold);
        Emitter.instance.emit(PlayerEventKeys.UPDATE_ATTRIBUTE_UI);
    },

    loadPlayerGold() {
        const savedGold = LocalStorageUnit.get("PlayerGold");
        if (savedGold !== null) {
            this.playerGold.string = savedGold.toString();
        } else {
            this.playerGold.string = "10000";
            this.savePlayerGold();
        }
    },

    savePlayerGold() {
        LocalStorageUnit.set("PlayerGold", parseInt(this.playerGold.string));
    },

});
