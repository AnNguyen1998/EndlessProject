const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');
const { SETTINGS } = require('./PopupKeys');
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
        cc.game.addPersistRootNode(this.node);
        this.eventMap = {
            [Popup.SHOW_SETTING_POPUP]: this.showPopup.bind(this, Popup.SETTINGS),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    onClickSetting() {
        this.showPopup(Popup.SETTINGS);
    },

    showPopup(name) {
        this.hideAllPopups();
        if (name === Popup.SETTINGS) {
            let node = this.popupItems.find(item => item.name === PopupItems.SETTINGS);
            if (node) {
                let popup = node.getComponent(PopupItems.SETTINGS);
                popup.show();
            }
        }
    },
    hideAllPopups() {
        this.popupItems.forEach(item => {
            let popup = item.getComponent(PopupItems.POPUP_ITEM);
            if (popup) {
                popup.hide();
            }
        });
    }

});