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
        currentLevel: cc.Label,
        currentChapter: cc.Label,
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
            [PlayerEventKeys.UPDATE_ATTRIBUTE_UI]: this.refreshDisplay.bind(this),
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
        this.node.stopAllActions();
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
        this.currentLevel.string = `Lv. ${PlayerData.getLevel()}`;
        this.currentChapter.string = `Chapter ${PlayerData.getHighestChapter()}`;
    },

    refreshDisplay() {
        this.playerGoldLabel.string = PlayerData.getGold().toString();
        for (const attributeNode of this._attributeNodeList) {
            this.updateSingleAttributeDisplay(attributeNode);
        }
        const spineBoy = cc.find("MainCanvas/Popup/UpgradePopup/SpineBoy").getComponent(sp.Skeleton);
        spineBoy.setAnimation(0, "portal", false);
        spineBoy.setCompleteListener(() => {
            spineBoy.setAnimation(0, "idle", true);
        })
    },

    updateSingleAttributeDisplay(attributeNode) {
        const attrName = attributeNode.attributeName;
        const attrConfig = attributeNode.config;
        const titleLabel = attributeNode.getChildByName("Title").getComponent(cc.Label);
        const valueLabel = attributeNode.getChildByName("AttributeValue").getComponent(cc.Label);
        const levelLabel = attributeNode.getChildByName("Level").getChildByName("Mask").getChildByName("LevelValue").getComponent(cc.Label);
        const upgradeButtonNode = attributeNode.getChildByName("AddButton");
        const goldLabel = attributeNode.getChildByName("GoldUpgrade").getComponent(cc.Label);
        const upgradeValueLabel = attributeNode.getChildByName("AttributeValueUpgrade").getComponent(cc.Label);
        const conditionLevel = attributeNode.getChildByName("Condition").getChildByName("LevelPlayer");
        const conditionChapter = attributeNode.getChildByName("Condition").getChildByName("Chapter");
        Emitter.instance.emit(PlayerEventKeys.REQUEST_UPGRADE_DISPLAY_DATA, attrName, (data) => {
            if (!data) {
                cc.warn(`No display data for ${attrName}`);
                return;
            }
            titleLabel.string = attrConfig.title;
            valueLabel.string = this.formatValue(attrConfig.name, data.currentValue);
            if (data.isMaxLevel) {
                levelLabel.string = "MAX";
                upgradeButtonNode.active = false;
                goldLabel.string = "";
                upgradeValueLabel.string = "";
            } else {
                levelLabel.string = `${data.currentLevel}`;
                upgradeButtonNode.active = true;
                goldLabel.string = data.upgradeInfo.price;
                upgradeValueLabel.string = `${this.formatValue(attrConfig.name, data.nextValue)}`;
                upgradeButtonNode.color = data.canUpgrade ? cc.Color.GREEN : cc.Color.GRAY;
                goldLabel.node.color = data.canUpgrade ? cc.Color.GREEN : cc.Color.RED;
                conditionLevel.getComponent(cc.Label).string = `Lv. ${data.upgradeInfo.condition.required_player_level}`;
                conditionChapter.getComponent(cc.Label).string = `Chapter ${data.upgradeInfo.condition.chapter}`;
            }
        });
    },

    formatValue(attrName, value) {
        if (attrName === 'hpLevel') {
            return value.toFixed(0);
        }
        return value.toFixed(1);
    }
});
