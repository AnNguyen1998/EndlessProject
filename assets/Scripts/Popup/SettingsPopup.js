const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');
const LocalStorageUnit = require('../Unit/LocalStorageUnit');
const LocalStorageKeys = require('../Unit/LocalStorageKeys');

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
        this.loadVolume();
    },
    
    onDestroy() {

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
        this.updateBackgroundMusicVolumeIcon();
        this.updateSoundEffectVolumeIcon();
        this.updateBackgroundMusicFill();
        this.updateSoundEffectFill();
    },
    
    onBackgroundMusicChanged() {
        this.saveVolume();
        this.updateBackgroundMusicVolumeIcon();
        this.updateBackgroundMusicFill();
        Emitter.instance.emit(Popup.CHANGED_SLIDER, { type: 'backgroundMusic', value: this.backgroundMusicSlider.progress });
    },
    
    onSoundEffectChanged() {
        this.saveVolume();
        this.updateSoundEffectVolumeIcon();
        this.updateSoundEffectFill();
        Emitter.instance.emit(Popup.CHANGED_SLIDER, { type: 'soundEffect', value: this.soundEffectSlider.progress });
    },
    
    saveVolume() {
        LocalStorageUnit.set(LocalStorageKeys.BACKGROUND_MUSIC_VOLUME, this.backgroundMusicSlider.progress);
        LocalStorageUnit.set(LocalStorageKeys.SOUND_EFFECT_VOLUME, this.soundEffectSlider.progress);
    },
    
    updateBackgroundMusicFill() {
        if (this.backgroundMusicFill && this.backgroundMusicSlider) {
            this.backgroundMusicFill.width = this.backgroundMusicSlider.progress * this.backgroundMusicSlider.node.width;
        }
    },
    
    updateSoundEffectFill() {
        if (this.soundEffectFill && this.soundEffectSlider) {
            this.soundEffectFill.width = this.soundEffectSlider.progress * this.soundEffectSlider.node.width;
        }
    },
    
    updateBackgroundMusicVolumeIcon() {
        if (!this.backgroundMusicSlider || !this.backgroundMusicVolumeIconOn || !this.backgroundMusicVolumeIconOff) return;
        const isOn = this.backgroundMusicSlider.progress > 0.001;
        if (this.backgroundMusicVolumeIconOn.node) this.backgroundMusicVolumeIconOn.node.active = isOn;
        if (this.backgroundMusicVolumeIconOff.node) this.backgroundMusicVolumeIconOff.node.active = !isOn;
    },
    
    updateSoundEffectVolumeIcon() {
        if (!this.soundEffectSlider || !this.soundEffectVolumeIconOn || !this.soundEffectVolumeIconOff) return;
        const isOn = this.soundEffectSlider.progress > 0.001;
        if (this.soundEffectVolumeIconOn.node) this.soundEffectVolumeIconOn.node.active = isOn;
        if (this.soundEffectVolumeIconOff.node) this.soundEffectVolumeIconOff.node.active = !isOn;
    },
});