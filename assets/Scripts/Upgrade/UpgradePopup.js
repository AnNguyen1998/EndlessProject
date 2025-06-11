const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');

cc.Class({
    extends: require('PopupItem'),

    properties: {
        attributePrefab: cc.Prefab,
        layout: cc.Layout,
        attributeJsonAsset: cc.JsonAsset,
        _attributeNodeList: [],
        _attributeConfig: null,
    },

    onLoad() {
        this._super();
        this.init();
    },

    init() {
        this.eventMap = {
            [PlayerEventKeys.UPDATE_ATTRIBUTE_UI]: this.updateAllAttributeDisplays.bind(this)
        }
        this._attributeConfig = this.attributeJsonAsset.json;
        this.initializeUI();
        this.updateAllAttributeDisplays();
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEvent(this.eventMap);
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
        Emitter.instance.emit(PlayerEventKeys.REQUEST_ATTRIBUTE_DATA, attrName, (currentAttrData) => {
            if (!currentAttrData) return;
            titleLabel.string = attrConfig.title;
            valueLabel.string = attrConfig.title === 'HP' ? currentAttrData.value.toFixed(0) : currentAttrData.value.toFixed(1);
            if (currentAttrData.level >= maxLevel) {
                levelLabel.string = "MAX";
                upgradeButtonNode.active = false;   
                goldLabel.string = "";
                upgradeValueLabel.string = "";
                return;
            }
            levelLabel.string = `${currentAttrData.level}`;
            upgradeButtonNode.active = true;
            Emitter.instance.emit(PlayerEventKeys.REQUEST_UPGRADE_INFO, attrName, currentAttrData.level, (upgradeInfo) => {
                if (upgradeInfo) {
                    goldLabel.string = upgradeInfo.price;

                    if (upgradeInfo.hasOwnProperty('multiplier')) {
                        upgradeValueLabel.string = `${(currentAttrData.value * upgradeInfo.multiplier).toFixed(1)}`;
                    } else if (upgradeInfo.hasOwnProperty('bonus')) {
                        upgradeValueLabel.string = `${(currentAttrData.value + upgradeInfo.bonus).toFixed(1)}`;
                    }
                    const playerGold = 100000;
                    if (playerGold < upgradeInfo.price) {
                        upgradeButton.interactable = false;
                        upgradeButtonNode.color = cc.Color.GRAY;
                    } else {
                        upgradeButton.interactable = true;
                        upgradeButtonNode.color = cc.Color.WHITE;
                    }
                } else {
                    goldLabel.string = "";
                    upgradeValueLabel.string = "";
                    upgradeButton.interactable = false;
                    upgradeButtonNode.color = cc.Color.GRAY;
                }
            });
        });
    }

});
