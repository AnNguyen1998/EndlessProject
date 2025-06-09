const Emitter = require('Emitter');
const { Popup } = require('EventKeys');

cc.Class({
    extends: cc.Component,

    onSettingsClick() {
        Emitter.instance.emit(Popup.SHOW_SETTING_POPUP);
    },
});
