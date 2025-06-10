const Emitter = require('../Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const LocalStorageUnit = require('./LocalStorageUnit');

const PlayerAttributeTemplate = {
    hpLevel: { value: 0, level: 1 },
    damage: { value: 0, level: 1 },
    critDamage: { value: 0, level: 1 },
    critRate: { value: 0, level: 1 },
    attackSpeed: { value: 0, level: 1 },
    getAttribute(attributeName) {
        return this[attributeName] ? this[attributeName].value : null;
    },
    setAttribute(attributeName, value) {
        if (this[attributeName]) {
            this[attributeName].value = value;
        }
    },
    getLevel(attributeName) {
        return this[attributeName] ? this[attributeName].level : null;
    },
    setLevel(attributeName, level) {
        if (this[attributeName]) {
            this[attributeName].level = level;
        }
    },
};

cc.Class({
    extends: require('./PopupItem'),

    properties: {
        attributePrefab: {
            default: null,
            type: cc.Prefab
        },
        layout: {
            default: null,
            type: cc.Layout
        },
        attributeJsonAsset: {
            default: null,
            type: cc.JsonAsset
        },
        _attributeNodeList: [],
        _playerAttribute: null,
        _attributeConfig: null,
    },

    onLoad() {
        this._super();
        this._attributeConfig = this.attributeJsonAsset.json;
        this.loadPlayerAttribute();
        this.initializeUI();
        this.updateAllAttributeDisplays();
        // Emitter.instance.on(PlayerEventKeys.UPGRADE_STAT, this.handleUpgradeStat, this);
    },

    onDestroy() {
        // Emitter.instance.off(PlayerEventKeys.UPGRADE_STAT, this.handleUpgradeStat, this);
    },

    loadPlayerAttribute() {
        const savedData = LocalStorageUnit.get("PlayerAttribute");
        this._playerAttribute = Object.create(PlayerAttributeTemplate);
        console.log("Loading Player Attribute from LocalStorage:", savedData);

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
        console.log("Player Attribute Loaded:", this._playerAttribute);
    },

    savePlayerAttribute() {
        const dataToSave = {
            hpLevel: this._playerAttribute.hpLevel,
            damage: this._playerAttribute.damage,
            critDamage: this._playerAttribute.critDamage,
            critRate: this._playerAttribute.critRate,
            attackSpeed: this._playerAttribute.attackSpeed,
        };
        LocalStorageUnit.set("PlayerAttribute", dataToSave);
        console.log("Player Attribute Saved:", dataToSave);
    },

    initializeUI() {
        this.layout.node.removeAllChildren();
        this._attributeNodeList = [];
        const attributes = this._attributeConfig.attributes;
        for (const attrConfig of attributes) {
            const attributeNode = cc.instantiate(this.attributePrefab);
            attributeNode.config = attrConfig;
            attributeNode.attributeName = attrConfig.name;
            const upgradeButton = attributeNode.getChildByName("AddButton").getComponent(cc.Button);
            this.layout.node.addChild(attributeNode);
            this._attributeNodeList.push(attributeNode);
        }
    },

    updateAllAttributeDisplays() {
        for (const attributeNode of this._attributeNodeList) {
            this.updateSingleAttributeDisplay(attributeNode);
        }
    },

    updateSingleAttributeDisplay(attributeNode) {
        const attrName = attributeNode.attributeName;
        const attrConfig = attributeNode.config;
        const currentAttrData = this._playerAttribute[attrName];
        console.log(`Updating attribute: ${attrName}`, currentAttrData);

        attributeNode.getChildByName("Title").getComponent(cc.Label).string = attrConfig.title;
        attributeNode.getChildByName("AttributeValue").getComponent(cc.Label).string = currentAttrData.value.toFixed(2);
        attributeNode.getChildByName("Level").getChildByName("Mask").getChildByName("LevelValue").getComponent(cc.Label).string = `${currentAttrData.level}`;
        const upgradeInfo = this.getUpgradeInfo(attrName, currentAttrData.level);
        const upgradeButton = attributeNode.getChildByName("UpgradeButton");
        if (upgradeInfo) {
            attributeNode.getChildByName("GoldUpgrade").getComponent(cc.Label).string = upgradeInfo.price;
            // upgradeButton.active = true;
        } else {
            // upgradeButton.active = false;
            attributeNode.getChildByName("Level").getChildByName("Mask").getChildByName("LevelValue").getComponent(cc.Label).string = `${currentAttrData.level}`;

        }
        const AttributeValueUpgradeInfo = attributeNode.getChildByName("AttributeValueUpgrade");
        if (upgradeInfo) {
            if (upgradeInfo.hasOwnProperty('multiplier')) {
                AttributeValueUpgradeInfo.getComponent(cc.Label).string = `${currentAttrData.value * upgradeInfo.multiplier}`;
            } else if (upgradeInfo.hasOwnProperty('bonus')) {
                AttributeValueUpgradeInfo.getComponent(cc.Label).string = `${currentAttrData.value + upgradeInfo.bonus}`;
            }
        } else {
            AttributeValueUpgradeInfo.getComponent(cc.Label).string = '';
        }
    },

    getUpgradeInfo(attributeName, currentLevel) {
        const factory = this._attributeConfig.attributes_factory.find(f => f.name === attributeName);
        if (!factory) return null;
        return factory.factory.find(f => f.level === currentLevel + 1) || null;
    },

    onClickAddStat(event, attributeName) {
        console.log(`Upgrade request for: ${attributeName}`);
        Emitter.instance.emit(PlayerEventKeys.UPGRADE_STAT, attributeName);
    },

    handleUpgradeStat(attributeName) {
        const currentAttrData = this._playerAttribute[attributeName];
        const upgradeInfo = this.getUpgradeInfo(attributeName, currentAttrData.level);
        if (!upgradeInfo) {
            console.warn(`Cannot upgrade ${attributeName}: Max level reached or no upgrade info found.`);
            return;
        }
        const playerGold = 100000;
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
        console.log(`Upgrading ${attributeName} to level ${currentAttrData.level + 1}`);
        currentAttrData.level++;
        if (upgradeInfo.hasOwnProperty('multiplier')) {
            currentAttrData.value *= upgradeInfo.multiplier;
        } else if (upgradeInfo.hasOwnProperty('bonus')) {
            currentAttrData.value += upgradeInfo.bonus;
        }
        this.savePlayerAttribute();
        const nodeToUpdate = this._attributeNodeList.find(n => n.attributeName === attributeName);
        if (nodeToUpdate) {
            this.updateSingleAttributeDisplay(nodeToUpdate);
        }
    }
});
