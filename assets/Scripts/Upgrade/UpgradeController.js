const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const PlayerData = require('PlayerTemplate');

cc.Class({
    extends: cc.Component,

    properties: {
        attributeJsonAsset: cc.JsonAsset,
        _attributeConfig: null,
    },



    onLoad() {
        this.init();
    },

    init() {
        this._attributeConfig = this.attributeJsonAsset.json;

        this.eventMap = {
            [PlayerEventKeys.REQUEST_UPGRADE]: this.handleUpgradeStat.bind(this),
            [PlayerEventKeys.REQUEST_ATTRIBUTE_DATA]: this.provideAttributeData.bind(this),
            [PlayerEventKeys.REQUEST_UPGRADE_INFO]: this.provideUpgradeInfo.bind(this),
            [PlayerEventKeys.REQUEST_UPGRADE_DISPLAY_DATA]: this.getUpgradeDisplayData.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEvent(this.eventMap);
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
                cc.warn(`Cannot upgrade ${attributeName}: Max level reached or no upgrade info found.`);
                return;
            }

            const playerGold = PlayerData.getGold();
            const playerLevel = PlayerData.getLevel();

            if (playerGold < upgradeInfo.price) {
                cc.log("Not enough gold!");
                return;
            }
            if (playerLevel < upgradeInfo.condition.required_player_level) {
                cc.log("Player level not high enough!");
                return;
            }

            PlayerData.addGold(-upgradeInfo.price);
            PlayerData.upgradeAttributeLevel(attributeName);

            let newValue = currentAttrData.value;
            if (upgradeInfo.hasOwnProperty('multiplier')) {
                newValue *= upgradeInfo.multiplier;
            } else if (upgradeInfo.hasOwnProperty('bonus')) {
                newValue += upgradeInfo.bonus;
            }
            PlayerData.updateAttributeValue(attributeName, newValue);

            PlayerData.save();
            cc.log(`Upgraded ${attributeName} successfully!`);

            Emitter.instance.emit(PlayerEventKeys.UPDATE_PLAYER_GOLD_UI, PlayerData.getGold());
            Emitter.instance.emit(PlayerEventKeys.UPDATE_ATTRIBUTE_UI, attributeName);
        });
    },
});
