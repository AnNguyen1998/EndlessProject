const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const PlayerData = require('PlayerTemplate');

cc.Class({
    extends: require('PopupItem'),

    properties: {
        attributePrefab: cc.Prefab,
        layout: cc.Layout,
        attributeJsonAsset: cc.JsonAsset,
        playerGoldLabel: cc.Label,

        _attributeNodeList: [],
        _attributeConfig: null,
    },

    onLoad() {
        this._super();
        this.init();
    },

    init() {
        PlayerData.load(); //TODO: Xoá đi sau khi có gameController hoàn chỉnh
        this.eventMap = {
            [PlayerEventKeys.UPGRADE_SUCCESS]: this.refreshDisplay.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);

        this._attributeConfig = this.attributeJsonAsset.json;
        this.initializeUI();
        PlayerData.save(); //TODO: Xoá đi sau khi có gameController hoàn chỉnh

    },

    onEnable() {
        this.refreshDisplay();
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
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

    refreshDisplay() {
        this.playerGoldLabel.string = PlayerData.getGold().toString();

        for (const attributeNode of this._attributeNodeList) {
            this.updateSingleAttributeDisplay(attributeNode);
        }
    },

    updateSingleAttributeDisplay(attributeNode) {
        const attrName = attributeNode.attributeName;
        const attrConfig = attributeNode.config;

        const titleLabel = attributeNode.getChildByName("Title").getComponent(cc.Label);
        const valueLabel = attributeNode.getChildByName("AttributeValue").getComponent(cc.Label);
        const levelLabel = attributeNode.getChildByName("Level").getChildByName("Mask").getChildByName("LevelValue").getComponent(cc.Label);
        const upgradeButtonNode = attributeNode.getChildByName("AddButton");
        const upgradeButton = upgradeButtonNode.getComponent(cc.Button);
        const goldLabel = attributeNode.getChildByName("GoldUpgrade").getComponent(cc.Label);
        const upgradeValueLabel = attributeNode.getChildByName("AttributeValueUpgrade").getComponent(cc.Label);

        Emitter.instance.emit(PlayerEventKeys.REQUEST_UPGRADE_DISPLAY_DATA, attrName, (data) => {
            if (!data) {
                cc.warn(`No display data for ${attrName}`);
                return;
            }

            titleLabel.string = attrConfig.title;
            valueLabel.string = this._formatValue(attrConfig.name, data.currentValue);

            if (data.isMaxLevel) {
                levelLabel.string = "MAX";
                upgradeButtonNode.active = false;
                goldLabel.string = "";
                upgradeValueLabel.string = "";
            } else {
                levelLabel.string = `${data.currentLevel}`;
                upgradeButtonNode.active = true;
                goldLabel.string = data.upgradeInfo.price;
                upgradeValueLabel.string = `+${this._formatValue(attrConfig.name, data.nextValue - data.currentValue)}`;
                
                upgradeButton.interactable = data.canUpgrade;
                upgradeButtonNode.color = data.canUpgrade ? cc.Color.WHITE : cc.Color.GRAY;
                goldLabel.node.color = data.canUpgrade ? cc.Color.WHITE : cc.Color.RED;
            }
        });
    },

    _formatValue(attrName, value) {
        if (attrName === 'hp') {
            return value.toFixed(0);
        }
        return value.toFixed(1);
    }
});
