const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');

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
            [Popup.SHOW_SETTING_POPUP]: this.showPopup.bind(this, 'SETTINGS'),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    onClickSetting() {
        this.showPopup('SETTINGS');
    },

    showPopup(name) {
        this.hideAllPopups();
        if (name === 'SETTINGS') {
            let node = this.popupItems.find(item => item.name === 'SettingsPopup');
            if (node) {
                let popup = node.getComponent('SettingsPopup');
                popup.show();
            }
        }
    },
    hideAllPopups() {
        this.popupItems.forEach(item => {
            let popup = item.getComponent('PopupItem');
            if (popup) {
                popup.hide();
            }
        });
    }

});