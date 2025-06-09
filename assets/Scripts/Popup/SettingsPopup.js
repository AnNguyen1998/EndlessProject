const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');

cc.Class({
    extends: require('./PopupItem'),
    properties: {
        backgroundMusicSlider: cc.Slider,
        soundEffectSlider: cc.Slider,
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
        if (Emitter.instance) {
            Emitter.instance.removeEvent('VOLUME_DATA_CHANGED', this.onVolumeDataChanged.bind(this));
        }
    },
    
    show() {
        this._super();
        this.loadVolume();
    },
    
    loadVolume() {
        let backgroundMusicVolume = cc.sys.localStorage.getItem('background_music_volume');
        let soundEffectVolume = cc.sys.localStorage.getItem('sound_effect_volume');
        this.backgroundMusicSlider.progress = backgroundMusicVolume !== null ? parseFloat(backgroundMusicVolume) : 0.7;
        this.soundEffectSlider.progress = soundEffectVolume !== null ? parseFloat(soundEffectVolume) : 0.8;
        this.updateBackgroundMusicVolumeIcon();
        this.updateSoundEffectVolumeIcon();
    },
    
    onBackgroundMusicChanged() {
        this.saveVolume();
        Emitter.instance.emit(Popup.CHANGED_SLIDER, { type: 'backgroundMusic', value: this.backgroundMusicSlider.progress });
        this.updateBackgroundMusicVolumeIcon();
    },
    
    onSoundEffectChanged() {
        this.saveVolume();
        Emitter.instance.emit(Popup.CHANGED_SLIDER, { type: 'soundEffect', value: this.soundEffectSlider.progress });
        this.updateSoundEffectVolumeIcon();
    },
    
    saveVolume() {
        cc.sys.localStorage.setItem('background_music_volume', this.backgroundMusicSlider.progress);
        cc.sys.localStorage.setItem('sound_effect_volume', this.soundEffectSlider.progress);
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