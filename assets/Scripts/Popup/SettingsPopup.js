const PopupItem = require('./PopupItem');
const mEmitter = require('../EventEmitter/Emitter');
import { Popup } from '../EventEmitter/EventKeys';

cc.Class({
    extends: PopupItem,

    properties: {
        musicVolumeSlider: {
            default: null,
            type: cc.Slider,
            displayName: "Music Volume Slider"
        },

        soundVolumeSlider: {
            default: null,
            type: cc.Slider,
            displayName: "Sound Volume Slider"
        },

        musicVolumeLabel: {
            default: null,
            type: cc.Label,
            displayName: "Music Volume Label"
        },

        soundVolumeLabel: {
            default: null,
            type: cc.Label,
            displayName: "Sound Volume Label"
        }
    },

    onLoad() {
        this._super();
        this.initializeSettings();
    },

    onDestroy() {
        this._super();

        if (this.musicVolumeSlider) {
            this.musicVolumeSlider.node.off('slide', this.onMusicVolumeChanged, this);
        }

        if (this.soundVolumeSlider) {
            this.soundVolumeSlider.node.off('slide', this.onSoundVolumeChanged, this);
        }

    },

    initializeSettings() {
        if (this.musicVolumeSlider) {
            this.musicVolumeSlider.node.on('slide', this.onMusicVolumeChanged, this);
        }

        if (this.soundVolumeSlider) {
            this.soundVolumeSlider.node.on('slide', this.onSoundVolumeChanged, this);
        }

        this.loadCurrentSettings();
    },

    loadCurrentSettings() {
        const musicVolume = parseFloat(cc.sys.localStorage.getItem('background_music_volume') || '0.8');
        const soundVolume = parseFloat(cc.sys.localStorage.getItem('sound_effect_volume') || '1.0');

        if (this.musicVolumeSlider) {
            this.musicVolumeSlider.progress = musicVolume;
        }

        if (this.soundVolumeSlider) {
            this.soundVolumeSlider.progress = soundVolume;
        }

        this.updateVolumeLabels();
    },

    updateVolumeLabels() {
        if (this.musicVolumeLabel && this.musicVolumeSlider) {
            this.musicVolumeLabel.string = Math.round(this.musicVolumeSlider.progress * 100) + '%';
        }

        if (this.soundVolumeLabel && this.soundVolumeSlider) {
            this.soundVolumeLabel.string = Math.round(this.soundVolumeSlider.progress * 100) + '%';
        }
    },

    onMusicVolumeChanged(slider) {
        const value = slider.progress;
        
        mEmitter.instance.emit(Popup.CHANGED_SLIDER, {
            type: 'backgroundMusic',
            value: value
        });

        this.updateVolumeLabels();
    },

    onSoundVolumeChanged(slider) {
        const value = slider.progress;
        
        mEmitter.instance.emit(Popup.CHANGED_SLIDER, {
            type: 'soundEffect',
            value: value
        });

        this.updateVolumeLabels();
    },

    onShow() {
        this._super();
        this.loadCurrentSettings();
    },

    onHide() {
        this._super();
    },

    setData(data) {
        this._super(data);
    },

});