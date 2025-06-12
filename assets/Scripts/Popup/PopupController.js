const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');
const { PopupKeys } = require('./PopupKeys');
cc.Class({
    extends: cc.Component,
    properties: {
        popupItems: {
            default: [],
            type: [cc.Node],
        },
    },

    onLoad() {
        this.init();
    },

    init() {

        this.eventMap = {
            [Popup.SHOW_SETTING_POPUP]: this.showPopup.bind(this, Popup.SHOW_SETTING_POPUP),
            [Popup.SHOW_UPGRADE_POPUP]: this.showPopup.bind(this, Popup.SHOW_UPGRADE_POPUP),
            [Popup.HIDE_UPGRADE_POPUP]: this.hideUpgradePopup.bind(this),
            [Popup.SHOW_TUTORIAL_POPUP]: this.showPopup.bind(this, Popup.SHOW_TUTORIAL_POPUP),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
        cc.game.addPersistRootNode(this.node);
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    showPopup(name) {
        this.hideAllPopups();
        switch (name) {
            case Popup.SHOW_SETTING_POPUP: {
                let node = this.popupItems.find(item => item.name === PopupKeys.SETTINGS);
                if (node) {
                    let popup = node.getComponent(PopupKeys.SETTINGS);
                    popup.show();
                }
                break;
            }
            case Popup.SHOW_UPGRADE_POPUP: {
                let node = this.popupItems.find(item => item.name === PopupKeys.UPGRADE);
                if (node) {
                    let popup = node.getComponent(PopupKeys.UPGRADE);
                    popup.show();
                }
                break;
            }
            case Popup.SHOW_TUTORIAL_POPUP: {
                let node = this.popupItems.find(item => item.name === PopupKeys.TUTORIAL);
                if (node) {
                    let popup = node.getComponent(PopupKeys.TUTORIAL);
                    popup.show();
                }
                break;
            }
        }
    },

    hideUpgradePopup() {
        let node = this.popupItems.find(item => item.name === PopupKeys.UPGRADE);
        if (node) {
            let popup = node.getComponent(PopupKeys.UPGRADE);
            if (popup) {
                popup.hide();
            }
        }
    },

    hideAllPopups() {
        this.popupItems.forEach(item => {
            let popup = item.getComponent(PopupKeys.POPUP_ITEM);
            if (popup) {
                popup.hide();
            }
        });
    }

});