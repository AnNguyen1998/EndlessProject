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