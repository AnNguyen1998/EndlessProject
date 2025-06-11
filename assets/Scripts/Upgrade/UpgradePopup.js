const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const LocalStorageUnit = require('LocalStorageUnit');
cc.Class({
    extends: require('PopupItem'),

    properties: {
        attributePrefab: cc.Prefab,
        layout: cc.Layout,
        attributeJsonAsset: cc.JsonAsset,
        _attributeNodeList: [],
        _attributeConfig: null,
        playerGold: {
            default: null,
            type: cc.Label
        }
    },

    onLoad() {
        this._super();
        this.init();
    },

    init() {
        this.eventMap = {
            [PlayerEventKeys.UPDATE_ATTRIBUTE_UI]: this.updateAllAttributeDisplays.bind(this),
            [PlayerEventKeys.UPDATE_PLAYER_GOLD_UI]: this.updateGoldUI.bind(this)
        }
        this._attributeConfig = this.attributeJsonAsset.json;
        this.initializeUI();
        this.loadPlayerGold();
        this.updateAllAttributeDisplays();
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    loadPlayerGold() {
        const savedGold = LocalStorageUnit.get("PlayerGold");
        this.playerGold.string = savedGold !== null ? savedGold.toString() : "10000";
    },

    updateGoldUI(newGold) {
        this.playerGold.string = newGold.toString();
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    initializeUI() {
        this.playerGold.string = 10000;
        const attributes = this._attributeConfig.attributes;
        for (const attrConfig of attributes) {
            const attributeNode = cc.instantiate(this.attributePrefab);
            attributeNode.config = attrConfig;
            attributeNode.attributeName = attrConfig.name;
            const upgradeButton = attributeNode.getChildByName("AddButton").getComponent(cc.Button);
            upgradeButton.node.on('click', () => {
                Emitter.instance.emit(PlayerEventKeys.REQUEST_UPGRADE, attrConfig.name);
            });
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
        const maxLevel = attrConfig.maxLevel;
        const titleLabel = attributeNode.getChildByName("Title").getComponent(cc.Label);
        const valueLabel = attributeNode.getChildByName("AttributeValue").getComponent(cc.Label);
        const levelLabel = attributeNode.getChildByName("Level").getChildByName("Mask").getChildByName("LevelValue").getComponent(cc.Label);
        const upgradeButtonNode = attributeNode.getChildByName("AddButton");
        const upgradeButton = upgradeButtonNode.getComponent(cc.Button);
        const goldLabel = attributeNode.getChildByName("GoldUpgrade").getComponent(cc.Label);
        const upgradeValueLabel = attributeNode.getChildByName("AttributeValueUpgrade").getComponent(cc.Label);

        Emitter.instance.emit(PlayerEventKeys.REQUEST_UPGRADE_DISPLAY_DATA, attrName, (data) => {
            if (!data) return;
            titleLabel.string = attrConfig.title;
            valueLabel.string = attrConfig.title === 'HP' ? data.currentValue.toFixed(0) : data.currentValue.toFixed(1);
            if (data.isMaxLevel || data.currentLevel >= maxLevel) {
                levelLabel.string = "MAX";
                upgradeButtonNode.active = false;
                goldLabel.string = "";
                upgradeValueLabel.string = "";
                return;
            }
            levelLabel.string = `${data.currentLevel}`;
            upgradeButtonNode.active = true;
            goldLabel.string = data.upgradeInfo.price;
            upgradeValueLabel.string = data.nextValue.toFixed(1);
            if (!data.canUpgrade) {
                upgradeButton.interactable = false;
                upgradeButtonNode.color = cc.Color.GRAY;
            } else {
                upgradeButton.interactable = true;
                upgradeButtonNode.color = cc.Color.WHITE;
            }
        });
    }

});
