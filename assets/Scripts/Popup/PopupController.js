const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');

cc.Class({
    extends: cc.Component,
    properties: {
        popupPrefabs: {
            default: [],
            type: [cc.Prefab],
        },
        _popupItems: [],
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.eventMap = {
            [Popup.SHOW_SETTING_POPUP]: this.showSettingsPopup.bind(this),
            [Popup.HIDE_SETTING_POPUP]: this.hideSettingsPopup.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    showSettingsPopup() {
        let popup = this._popupItems.find(popup => popup && popup.node && popup.node.isValid && popup.popupType === 'settings');
        if (popup) {
            popup.show();
            return;
        }
        let prefab = this.popupPrefabs.find(prefab => prefab && prefab.name === 'SettingsPopup');
        if (prefab) {
            let instance = cc.instantiate(prefab);
            let canvas = cc.director.getScene().getChildByName('Canvas');
            if (canvas) canvas.addChild(instance);
            else this.node.addChild(instance);
            let popup = instance.getComponent('SettingsPopup');
            if (popup) {
                popup.popupType = 'settings';
                this._popupItems.push(popup);
                popup.show();
            } else {
                instance.active = true;
            }
        }
    },

    hideSettingsPopup() {
        let popup = this._popupItems.find(p => p && p.node && p.node.active && p.popupType === 'settings');
        if (popup) popup.hide();
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
        this._popupItems.forEach(item => {
            if (item && item.node && item.node.isValid) {
                item.node.destroy();
            }
        });
        this._popupItems = [];
    }
});