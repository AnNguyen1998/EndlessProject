const Emitter = require('../Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const LocalStorageUnit = require('LocalStorageUnit');

const PlayerAttribute = {
    hpLevel: {
        value: 0,
        level: 1
    },
    damage: {
        value: 0,
        level: 1
    },
    critDamage: {
        value: 0,
        level: 1
    },
    critRate: {
        value: 0,
        level: 1
    },
    attackSpeed: {
        value: 0,
        level: 1
    },
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
        attributePrefabs: {
            default: null,
            type: cc.Prefab
        },
        layout: {
            default: null,
            type: cc.Layout
        },
        attributeList: {
            default: [],
            type: [cc.Node]
        },
        attributeJsonAsset: {
            default: null,
            type: cc.JsonAsset
        },
        playerAttribute: {
            default: null,
            type: cc.Object
        },
    },

    onLoad() {
        this._super();
        this.loadPlayerAttribute();
        this.init();
    },

    init() {
        const attributes = this.attributeJsonAsset.json.attributes;
        const attributeFactory = this.attributeJsonAsset.json.attributes_factory;
        for (let i = 0; i < attributes.length; i++) {
            const jsonAttribute = attributes[i];
            const jsonAttributeFactory = attributeFactory[i];
            const attributeNode = cc.instantiate(this.attributePrefabs);
            attributeNode.getChildByName("Title").getComponent(cc.Label).string = jsonAttribute.title;
            attributeNode.getChildByName("AttributeValue").getComponent(cc.Label).string = jsonAttribute.defaultAttribute;
            this.layout.node.addChild(attributeNode);
            this.attributeList.push(attributeNode);
        }
    },

    loadPlayerAttribute() {
        const savedAttribute = LocalStorageUnit.get("PlayerAttribute");
        if (savedAttribute) {
            this.playerAttribute = savedAttribute;
        } else {
            this.playerAttribute = Object.assign({}, PlayerAttribute);
            const attributes = this.attributeJsonAsset.json.attributes;
            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i];
                this.playerAttribute.setAttribute(attribute.name, attribute.defaultAttribute);
            }
            LocalStorageUnit.set("PlayerAttribute", this.playerAttribute);
        }
        console.log(this.playerAttribute);
    },

    onClickAddStat(title) {
        Emitter.instance.emit(PlayerEventKeys.UPGRADE_STAT, title);
    }
});
