const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const PlayerData = require('PlayerTemplate');

cc.Class({
    extends: cc.Component,

    properties: {
        attributeJsonAsset: cc.JsonAsset,
        _attributeConfig: null,
        toast: cc.Node,
    },

    onLoad() {
        this.init();
        this.toast.getComponent(cc.Animation).on('finished', () => {
            this.toast.active = false;
        });
        this.toast.active = false;
    },

    init() {
        this._attributeConfig = this.attributeJsonAsset.json;
        this.eventMap = {
            [PlayerEventKeys.REQUEST_UPGRADE]: this.handleUpgradeStat.bind(this),
            [PlayerEventKeys.REQUEST_ATTRIBUTE_DATA]: this.provideAttributeData.bind(this),
            [PlayerEventKeys.REQUEST_UPGRADE_DISPLAY_DATA]: this.getUpgradeDisplayData.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    provideAttributeData(attributeName, callback) {
        if (typeof callback === 'function') {
            callback(PlayerData.getAttribute(attributeName));
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
        const attrData = PlayerData.getAttribute(attributeName);
        if (!attrData) {
            callback(null);
            return;
        }
        const currentValue = attrData.value;
        const currentLevel = attrData.level;
        const playerGold = PlayerData.getGold();
        this.provideUpgradeInfo(attributeName, currentLevel, (upgradeInfo) => {
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
                playerGold: playerGold,
                canUpgrade: upgradeInfo ? playerGold >= upgradeInfo.price : false,
            };
            callback(displayData);
        });
    },

    handleUpgradeStat(attributeName) {
        const currentAttrData = PlayerData.getAttribute(attributeName);
        if (!currentAttrData) return;
        this.provideUpgradeInfo(attributeName, currentAttrData.level, (upgradeInfo) => {
            if (!upgradeInfo) {
                this.toast.getChildByName("Content").getComponent(cc.Label).string = `Cannot upgrade ${attributeName}: Max level reached or no upgrade info found.`;
                this.toast.getComponent(cc.Animation).play();
                return;
            }
            const playerGold = PlayerData.getGold();
            const playerLevel = PlayerData.getLevel();
            const highestChapter = PlayerData.getHighestChapter();
            if (playerGold < upgradeInfo.price) {
                this.toast.getChildByName("Content").getComponent(cc.Label).string = "Not enough gold!";
                this.toast.getComponent(cc.Animation).play();
                return;
            }
            if (playerLevel < upgradeInfo.condition.required_player_level) {
                this.toast.getChildByName("Content").getComponent(cc.Label).string = `Player level must be ${upgradeInfo.condition.required_player_level}!`;
                this.toast.getComponent(cc.Animation).play();
                return;
            }
            if (highestChapter < upgradeInfo.condition.chapter) {
                this.toast.getChildByName("Content").getComponent(cc.Label).string = `Chapter must be ${upgradeInfo.condition.chapter}!`;
                this.toast.getComponent(cc.Animation).play();
                return;
            }
            PlayerData.addGold(-upgradeInfo.price);
            PlayerData.upgradeAttributeLevel(attributeName);
            let newValue = currentAttrData.value;
            console.log(upgradeInfo)
            if (upgradeInfo.hasOwnProperty('multiplier')) {
                newValue *= upgradeInfo.multiplier;
            } else if (upgradeInfo.hasOwnProperty('bonus')) {
                newValue += upgradeInfo.bonus;
            }
            PlayerData.updateAttributeValue(attributeName, newValue);
            PlayerData.save();
            this.toast.getChildByName("Content").getComponent(cc.Label).string = `Upgraded ${attributeName} successfully!`;
            this.toast.getComponent(cc.Animation).play();
            Emitter.instance.emit(PlayerEventKeys.UPDATE_ATTRIBUTE_UI, attributeName);
        });
    },
});
