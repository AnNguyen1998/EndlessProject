const PopupItem = require('./PopupItem');
const mEmitter = require('../EventEmitter/Emitter');
import { Popup } from '../EventEmitter/EventKeys';

cc.Class({
    extends: cc.Component,
    properties: {
        backgroundItem: PopupItem,
        effectItem: PopupItem,
        closeButton: cc.Button
    },
    onLoad() {
        mEmitter.instance.registerEvent(Popup.CHANGED_SLIDER, this.onSliderChanged.bind(this));
        this.backgroundItem.init({
            nameKey: 'Nhạc nền',
            value: cc.sys.localStorage.getItem('background_music_volume') ? parseFloat(cc.sys.localStorage.getItem('background_music_volume')) : 0.8,
            onValueChanged: (v) => {
                mEmitter.instance.emit(Popup.CHANGED_SLIDER, { type: 'backgroundMusic', value: v });
            }
        });
        this.effectItem.init({
            nameKey: 'Hiệu ứng',
            value: cc.sys.localStorage.getItem('sound_effect_volume') ? parseFloat(cc.sys.localStorage.getItem('sound_effect_volume')) : 1.0,
            onValueChanged: (v) => {
                mEmitter.instance.emit(Popup.CHANGED_SLIDER, { type: 'soundEffect', value: v });
            }
        });
        this.closeButton.node.on('click', this.close, this);
    },
    onSliderChanged(data) {
        // Có thể xử lý UI nếu muốn
    },
    close() {
        this.node.active = false;
    },
    onDestroy() {
        mEmitter.instance.removeEvent(Popup.CHANGED_SLIDER, this.onSliderChanged);
    }
});
module.exports = SettingsPopup; 