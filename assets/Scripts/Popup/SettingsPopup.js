const Emitter = require('Emitter');
const { Popup, Game : GameEventKeys } = require('EventKeys');
const LocalStorageUnit = require('LocalStorageUnit');
const LocalStorageKeys = require('LocalStorageKeys');
const SoundKeys = require('SoundKeys');

cc.Class({
    extends: require('./PopupItem'),
    properties: {
        backgroundMusicSlider: cc.Slider,
        soundEffectSlider: cc.Slider,
        backgroundMusicFill: cc.Node,
        soundEffectFill: cc.Node,
        closeButton: cc.Button,
        tutorialButton: cc.Button, 
        exitButton: cc.Button, 
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
        if (this.tutorialButton) this.tutorialButton.node.on('click', this.onTutorialClick, this);
        if (this.exitButton) this.exitButton.node.on('click', this.onExitClick, this);

        this._boundSoundVolumeChanged = this.onSoundVolumeChanged.bind(this);
        Emitter.instance.registerEvent(SoundKeys.SOUND_VOLUME_CHANGED, this._boundSoundVolumeChanged);
        this.loadVolume();
    },
    onDestroy() {
        if (Emitter.instance && this._boundSoundVolumeChanged) {
            Emitter.instance.removeEvent(SoundKeys.SOUND_VOLUME_CHANGED, this._boundSoundVolumeChanged);
        }
        
        if (this.backgroundMusicSlider && this.backgroundMusicSlider.node) {
            this.backgroundMusicSlider.node.off('slide', this.onBackgroundMusicChanged, this);
        }
        if (this.soundEffectSlider && this.soundEffectSlider.node) {
            this.soundEffectSlider.node.off('slide', this.onSoundEffectChanged, this);
        }
        
        if (this.closeButton && this.closeButton.node) {
            this.closeButton.node.off('click', this.hide, this);
        }
        if (this.tutorialButton && this.tutorialButton.node) {
            this.tutorialButton.node.off('click', this.onTutorialClick, this);
        }
        if (this.exitButton && this.exitButton.node) {
            this.exitButton.node.off('click', this.onExitClick, this);
        }
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
        if (!this.node || !this.node.isValid) {
            return;
        }
        
        console.log(data.value);
        if (data.type === SoundKeys.BACKGROUND_MUSIC) {
            if (this.backgroundMusicSlider && this.backgroundMusicSlider.isValid) {
                this.backgroundMusicSlider.progress = data.value;
                this.updateBackgroundMusicVolumeIcon(data.value);
                this.updateBackgroundMusicFill(data.value);
            }
        } else if (data.type === SoundKeys.SOUND_EFFECT) {
            if (this.soundEffectSlider && this.soundEffectSlider.isValid) {
                this.soundEffectSlider.progress = data.value;
                this.updateSoundEffectVolumeIcon(data.value);
                this.updateSoundEffectFill(data.value);
            }
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
    
    onTutorialClick() {
        Emitter.instance.emit(Popup.SHOW_TUTORIAL_POPUP);
    },
    
    onExitClick() {
        Emitter.instance.emit(GameEventKeys.END_GAME);
        cc.director.loadScene('Portal', (err) => {
            if (err) {
                console.error('Failed to load Portal scene:', err);
            } 
        });
        
 

    },
});