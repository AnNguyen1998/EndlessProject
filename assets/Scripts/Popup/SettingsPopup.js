const Emitter = require('../EventEmitter/Emitter');
const { Popup } = require('../EventEmitter/EventKeys');

cc.Class({
    extends: require('./PopupItem'),
    properties: {
        backgroundMusicSlider: cc.Slider,
        soundEffectSlider: cc.Slider,
        closeButton: cc.Button,
        backgroundMusicVolumeIconOn: {
            type: cc.Sprite,
            default: null
        },
        backgroundMusicVolumeIconOff: {
            type: cc.Sprite,
            default: null
        },
        soundEffectVolumeIconOn: {
            type: cc.Sprite,
            default: null
        },
        soundEffectVolumeIconOff: {
            type: cc.Sprite,
            default: null
        }
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
        let bgm = cc.sys.localStorage.getItem('bgm_volume');
        let sfx = cc.sys.localStorage.getItem('sfx_volume');
        this.bgmSlider.progress = bgm !== null ? parseFloat(bgm) : 0.7;
        this.sfxSlider.progress = sfx !== null ? parseFloat(sfx) : 0.8;
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
        cc.sys.localStorage.setItem('bgm_volume', this.bgmSlider.progress);
        cc.sys.localStorage.setItem('sfx_volume', this.sfxSlider.progress);
    },
    
    updateBackgroundMusicVolumeIcon() {
        if (!this.backgroundMusicSlider || !this.backgroundMusicVolumeIconOn || !this.backgroundMusicVolumeIconOff) return;
        
        const isOn = this.bgmSlider.progress > 0.001;
        if (this.bgmVolumeIconOn.node) {
            this.bgmVolumeIconOn.node.active = isOn;
        }
        if (this.bgmVolumeIconOff.node) {
            this.bgmVolumeIconOff.node.active = !isOn;
        }
    },
    
    updateSoundEffectVolumeIcon() {
        if (!this.soundEffectSlider || !this.soundEffectVolumeIconOn || !this.soundEffectVolumeIconOff) return;
        
        const isOn = this.sfxSlider.progress > 0.001;
        if (this.sfxVolumeIconOn.node) {
            this.sfxVolumeIconOn.node.active = isOn;
        }
        if (this.sfxVolumeIconOff.node) {
            this.sfxVolumeIconOff.node.active = !isOn;
        }
    },
});