const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');
const LocalStorageUnit = require('../Unit/LocalStorageUnit');
const LocalStorageKeys = require('../Unit/LocalStorageKeys');
const SoundKeys = require('../Sound/SoundKeys');

cc.Class({
    extends: require('./PopupItem'),
    properties: {
        backgroundMusicSlider: cc.Slider,
        soundEffectSlider: cc.Slider,
        backgroundMusicFill: cc.Node,
        soundEffectFill: cc.Node,
        closeButton: cc.Button,
        backgroundMusicVolumeIconOn: cc.Sprite,
        backgroundMusicVolumeIconOff: cc.Sprite,
        soundEffectVolumeIconOn: cc.Sprite,
        soundEffectVolumeIconOff: cc.Sprite,
    },
    
    onLoad() {
        this._super();
        this.backgroundMusicSlider.node.on('slide', this.onBackgroundMusicChanged, this);
        this.soundEffectSlider.node.on('slide', this.onSoundEffectChanged, this);
        if (this.closeButton) this.closeButton.node.on('click', this.hide, this);
        Emitter.instance.registerEvent(SoundKeys.SOUND_VOLUME_CHANGED, this.onSoundVolumeChanged.bind(this));
        this.loadVolume();
    },
    
    onDestroy() {
        Emitter.instance.removeEvent(SoundKeys.SOUND_VOLUME_CHANGED, this.onSoundVolumeChanged);
    },
    
    show() {
        this._super();
        this.loadVolume();
    },
    
    loadVolume() {
        let backgroundMusicVolume = LocalStorageUnit.get(LocalStorageKeys.BACKGROUND_MUSIC_VOLUME);
        let soundEffectVolume = LocalStorageUnit.get(LocalStorageKeys.SOUND_EFFECT_VOLUME);
        this.backgroundMusicSlider.progress = backgroundMusicVolume !== null ? parseFloat(backgroundMusicVolume) : 0.7;
        this.soundEffectSlider.progress = soundEffectVolume !== null ? parseFloat(soundEffectVolume) : 0.8;
        this.updateBackgroundMusicVolumeIcon(this.backgroundMusicSlider.progress);
        this.updateBackgroundMusicFill(this.backgroundMusicSlider.progress);
        this.updateSoundEffectVolumeIcon(this.soundEffectSlider.progress);
        this.updateSoundEffectFill(this.soundEffectSlider.progress);
    },
    
    onBackgroundMusicChanged() {
        console.log(this.backgroundMusicSlider.progress);
        Emitter.instance.emit(Popup.CHANGED_SLIDER, { type: SoundKeys.BACKGROUND_MUSIC, value: this.backgroundMusicSlider.progress });
    },
    
    onSoundEffectChanged() {
        Emitter.instance.emit(Popup.CHANGED_SLIDER, { type: SoundKeys.SOUND_EFFECT, value: this.soundEffectSlider.progress });
    },
    
    onSoundVolumeChanged(data) {
        console.log(data.value);
        if (data.type === SoundKeys.BACKGROUND_MUSIC) {
            this.backgroundMusicSlider.progress = data.value;
            this.updateBackgroundMusicVolumeIcon(data.value);
            this.updateBackgroundMusicFill(data.value);
        } else if (data.type === SoundKeys.SOUND_EFFECT) {
            this.soundEffectSlider.progress = data.value;
            this.updateSoundEffectVolumeIcon(data.value);
            this.updateSoundEffectFill(data.value);
        }
    },
    
    updateBackgroundMusicFill(value) {
        if (this.backgroundMusicFill && this.backgroundMusicSlider) {
            this.backgroundMusicFill.width = value * this.backgroundMusicSlider.node.width;
        }
    },
    
    updateSoundEffectFill(value) {
        if (this.soundEffectFill && this.soundEffectSlider) {
            this.soundEffectFill.width = value * this.soundEffectSlider.node.width;
        }
    },
    
    updateBackgroundMusicVolumeIcon(value) {
        const isOn = value > 0.001;
        if (this.backgroundMusicVolumeIconOn.node) this.backgroundMusicVolumeIconOn.node.active = isOn;
        if (this.backgroundMusicVolumeIconOff.node) this.backgroundMusicVolumeIconOff.node.active = !isOn;
    },
    
    updateSoundEffectVolumeIcon(value) {
        const isOn = value > 0.001;
        if (this.soundEffectVolumeIconOn.node) this.soundEffectVolumeIconOn.node.active = isOn;
        if (this.soundEffectVolumeIconOff.node) this.soundEffectVolumeIconOff.node.active = !isOn;
    },
});