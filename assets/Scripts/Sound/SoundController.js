const Emitter = require('../EventEmitter/Emitter');
const { Popup, Game : GameEventKeys, Player, Monster } = require('../EventEmitter/EventKeys');
const LocalStorageUnit = require('../Unit/LocalStorageUnit');
const LocalStorageKeys = require('../Unit/LocalStorageKeys');
const SoundKeys = require('./SoundKeys');

const SoundController = cc.Class({
    extends: cc.Component,

    properties: {
        musicClips: {
            default: [],
            type: [cc.AudioClip],
        },
        
        soundEffectClips: {
            default: [],
            type: [cc.AudioClip],
        },

        backgroundMusicVolume: {
            default: 0.8,
            range: [0, 1],
            step: 0.1,
        },

        soundEffectVolume: {
            default: 1.0,
            range: [0, 1],
            step: 0.1,
        }
    },

    onLoad() {
        this.init();
    },

    init() {
        this.currentMusicId = -1;
        this.musicClipMap = new Map();
        this.soundClipMap = new Map();
        
        this.loadSettings();
        
        this.setupAudioClips();
        
        this.playDefaultMusic();
        
        this.eventMap = {
            [Popup.CHANGED_SLIDER]: this.onVolumeChanged.bind(this),
            [GameEventKeys.START_GAME]: this.onGameStart.bind(this),
            [GameEventKeys.END_GAME]: this.onGameEnd.bind(this),
            [GameEventKeys.PAUSE_GAME]: this.onGamePause.bind(this),
            [GameEventKeys.RESUME_GAME]: this.onGameResume.bind(this),
            [Player.JUMP]: () => this.playSoundEffect('jump'),
            [Player.ATTACK]: () => this.playSoundEffect('attack'),
            [Monster.MONSTER_DIE]: () => this.playSoundEffect('monster_die'),
            [Monster.MONSTER_HIT]: () => this.playSoundEffect('monster_hit'),
            'click': () => this.playSoundEffect('click'),
        };

        this.registerEvents();

        cc.game.addPersistRootNode(this.node);

    },

    setupAudioClips() {
        this.musicClips.forEach(clip => {
            if (clip) {
                this.musicClipMap.set(clip.name, clip);
            }
        });

        this.soundEffectClips.forEach(clip => {
            if (clip) {
                this.soundClipMap.set(clip.name, clip);
            }
        });
    },

    registerEvents() {
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    playMusic(musicName, loop = true, fadeIn = false) {
        const clip = this.musicClipMap.get(musicName);
        if (!clip) {
            console.warn(`Music clip '${musicName}' not found`);
            return;
        }

        this.stopMusic();

        const finalVolume = this.backgroundMusicVolume;
        
        this.currentMusicId = cc.audioEngine.playMusic(clip, loop);
        cc.audioEngine.setVolume(this.currentMusicId, fadeIn ? 0 : finalVolume);

        if (fadeIn) {
            this.fadeInMusic(finalVolume, 2.0); 
        }
        
    },

    stopMusic(fadeOut = false) {
        if (this.currentMusicId !== -1) {
            if (fadeOut) {
                this.fadeOutMusic(1.0); 
            } else {
                cc.audioEngine.stopMusic();
                this.currentMusicId = -1;
            }
        }
    },

    pauseMusic() {
        if (this.currentMusicId !== -1) {
            cc.audioEngine.pauseMusic();
        }
    },

    resumeMusic() {
        if (this.currentMusicId !== -1) {
            cc.audioEngine.resumeMusic();
        }
    },

    fadeInMusic(targetVolume, duration) {
        const steps = 20;
        const stepVolume = targetVolume / steps;
        const stepTime = duration / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const volume = stepVolume * currentStep;
            cc.audioEngine.setVolume(this.currentMusicId, volume);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
            }
        }, stepTime * 1000);
    },

    fadeOutMusic(duration) {
        const currentVolume = cc.audioEngine.getVolume(this.currentMusicId);
        const steps = 20;
        const stepVolume = currentVolume / steps;
        const stepTime = duration / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const volume = currentVolume - (stepVolume * currentStep);
            cc.audioEngine.setVolume(this.currentMusicId, Math.max(0, volume));

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                cc.audioEngine.stopMusic();
                this.currentMusicId = -1;
            }
        }, stepTime * 1000);
    },

    playSoundEffect(soundName, individualVolume = 1.0) {
        const clip = this.soundClipMap.get(soundName);
        if (!clip) {
            console.warn(`Sound effect '${soundName}' not found`);
            return;
        }

        const finalVolume = this.soundEffectVolume * individualVolume;
        
        return cc.audioEngine.playEffect(clip, false, finalVolume);
    },

    stopSoundEffect(audioId) {
        if (audioId !== undefined) {
            cc.audioEngine.stopEffect(audioId);
        }
    },

    stopAllSoundEffects() {
        cc.audioEngine.stopAllEffects();
    },

    setBackgroundMusicVolume(volume) {
        this.backgroundMusicVolume = cc.misc.clampf(volume, 0, 1);
        cc.audioEngine.setMusicVolume(this.backgroundMusicVolume);
        this.saveSettings();
        console.log(this.backgroundMusicVolume);
        Emitter.instance.emit(SoundKeys.SOUND_VOLUME_CHANGED, { type: SoundKeys.BACKGROUND_MUSIC, value: this.backgroundMusicVolume });
    },

    setSoundEffectVolume(volume) {
        this.soundEffectVolume = cc.misc.clampf(volume, 0, 1);
        cc.audioEngine.setEffectsVolume(this.soundEffectVolume);
        this.saveSettings();
        Emitter.instance.emit(SoundKeys.SOUND_VOLUME_CHANGED, { type: SoundKeys.SOUND_EFFECT, value: this.soundEffectVolume });
    },
    
    onVolumeChanged(data) {
        console.log(data);
        switch(data.type) {
            case SoundKeys.BACKGROUND_MUSIC:
                this.setBackgroundMusicVolume(data.value);
                break;
            case SoundKeys.SOUND_EFFECT:
                this.setSoundEffectVolume(data.value);
                break;
        }
    },

    onGameStart() {},

    onGameEnd() {
        this.stopMusic(true);
        this.stopAllSoundEffects();
        this.onDestroy();
    },

    onGamePause() {
        this.pauseMusic();
    },

    onGameResume() {
        this.resumeMusic();
    },

    loadSettings() {
        const backgroundMusicVol = LocalStorageUnit.get(LocalStorageKeys.BACKGROUND_MUSIC_VOLUME);
        const soundEffectVol = LocalStorageUnit.get(LocalStorageKeys.SOUND_EFFECT_VOLUME);

        if (backgroundMusicVol !== null) this.backgroundMusicVolume = parseFloat(backgroundMusicVol);
        if (soundEffectVol !== null) this.soundEffectVolume = parseFloat(soundEffectVol);
    },

    saveSettings() {
        LocalStorageUnit.set(LocalStorageKeys.BACKGROUND_MUSIC_VOLUME, this.backgroundMusicVolume);
        LocalStorageUnit.set(LocalStorageKeys.SOUND_EFFECT_VOLUME, this.soundEffectVolume);
    },

    playDefaultMusic() {
        if (this.musicClips.length > 0) {
            this.playMusic(this.musicClips[0].name, true, true);
        }
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
        this.stopMusic();
        this.stopAllSoundEffects();
    },


});

module.exports = SoundController;