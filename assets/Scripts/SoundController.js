const mEmitter = require('./EventEmitter/Emitter');
import { Popup, Game, Player, Monster } from './EventEmitter/EventsKey';

const SoundController = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
        
        getInstance() {
            if (!this.instance) {
                this.instance = new SoundController();
            }
            return this.instance;
        }
    },

    properties: {
        musicClips: {
            default: [],
            type: [cc.AudioClip],
            displayName: "Background Music Clips"
        },
        
        soundEffectClips: {
            default: [],
            type: [cc.AudioClip],
            displayName: "Sound Effect Clips"
        },

        backgroundMusicVolume: {
            default: 0.8,
            range: [0, 1],
            step: 0.1,
            displayName: "Background Music Volume",
        },

        soundEffectVolume: {
            default: 1.0,
            range: [0, 1],
            step: 0.1,
            displayName: "Sound Effect Volume",
        }
    },

    onLoad() {
        this.init();
    },

    init() {
        if (SoundController.instance) {
            this.destroy();
            return;
        }
        SoundController.instance = this;
        cc.game.addPersistRootNode(this.node);

        this.currentMusicId = -1;
        this.musicClipMap = new Map();
        this.soundClipMap = new Map();
        
        this.loadSettings();
        
        this.setupAudioClips();
        
        this.registerEvents();
        
        console.log('SoundController initialized');
        console.log(`Volume Settings - Background Music: ${this.backgroundMusicVolume}, Sound Effect: ${this.soundEffectVolume}`);
    },

    onDestroy() {
        mEmitter.instance.removeEvent(Popup.CHANGED_SLIDER, this.onVolumeChanged);
        
        this.stopMusic();
        this.stopAllSoundEffects();
        
        SoundController.instance = null;
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
        mEmitter.instance.registerEvent(Popup.CHANGED_SLIDER, this.onVolumeChanged.bind(this));

        mEmitter.instance.registerEvent(Game.START_GAME, this.onGameStart.bind(this));
        mEmitter.instance.registerEvent(Game.END_GAME, this.onGameEnd.bind(this));
        mEmitter.instance.registerEvent(Game.PAUSE_GAME, this.onGamePause.bind(this));
        mEmitter.instance.registerEvent(Game.RESUME_GAME, this.onGameResume.bind(this));

        mEmitter.instance.registerEvent(Player.JUMP, () => this.playSoundEffect('jump'));
        mEmitter.instance.registerEvent(Player.ATTACK, () => this.playSoundEffect('attack'));

        mEmitter.instance.registerEvent(Monster.MONSTER_DIE, () => this.playSoundEffect('monster_die'));
        mEmitter.instance.registerEvent(Monster.MONSTER_HIT, () => this.playSoundEffect('monster_hit'));
    },

    playMusic(musicName, loop = true, fadeIn = false) {
        const clip = this.musicClipMap.get(musicName);
        if (!clip) {
            console.warn(`Music clip '${musicName}' not found`);
            return;
        }

        this.stopMusic();

        const finalVolume = this.backgroundMusicVolume;
        console.log(`Playing music '${musicName}' with volume: ${finalVolume}`);
        
        this.currentMusicId = cc.audioEngine.playMusic(clip, loop);
        cc.audioEngine.setVolume(this.currentMusicId, fadeIn ? 0 : finalVolume);

        if (fadeIn) {
            this.fadeInMusic(finalVolume, 2.0); // 2 seconds fade in
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

        // Volume trực tiếp cho sound effect
        const finalVolume = this.soundEffectVolume * individualVolume;
        console.log(`Playing sound '${soundName}' with volume: ${finalVolume} (Sound Effect: ${this.soundEffectVolume} × Individual: ${individualVolume})`);
        
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

    // Volume control methods - chỉ còn 2 methods
    setBackgroundMusicVolume(volume) {
        const oldVolume = this.backgroundMusicVolume;
        this.backgroundMusicVolume = cc.misc.clampf(volume, 0, 1);
        console.log(`Background Music Volume changed: ${oldVolume} → ${this.backgroundMusicVolume}`);
        
        this.updateMusicVolume();
        this.saveSettings();
    },

    setSoundEffectVolume(volume) {
        const oldVolume = this.soundEffectVolume;
        this.soundEffectVolume = cc.misc.clampf(volume, 0, 1);
        console.log(`Sound Effect Volume changed: ${oldVolume} → ${this.soundEffectVolume}`);
        
        this.saveSettings();
    },

    updateBackgroundMusicVolume() {
        if (this.currentMusicId !== -1) {
            const finalVolume = this.backgroundMusicVolume;
            cc.audioEngine.setVolume(this.currentMusicId, finalVolume);
            console.log(`Updated current music volume to: ${finalVolume}`);
        }
    },


    onVolumeChanged(data) {
        switch(data.type) {
            case 'backgroundMusic':
                this.setBackgroundMusicVolume(data.value);
                break;
            case 'soundEffect':
                this.setSoundEffectVolume(data.value);
                break;
        }
    },

    onGameStart() {
        this.playMusic('game_music', true, true);
    },

    onGameEnd() {
        this.stopMusic(true);
        this.stopAllSoundEffects();
    },

    onGamePause() {
        this.pauseMusic();
    },

    onGameResume() {
        this.resumeMusic();
    },

    loadSettings() {
        const backgroundMusicVol = cc.sys.localStorage.getItem('background_music_volume') || cc.sys.localStorage.getItem('music_volume'); // Backward compatibility
        const soundEffectVol = cc.sys.localStorage.getItem('sound_effect_volume') || cc.sys.localStorage.getItem('sound_volume'); // Backward compatibility

        if (backgroundMusicVol !== null) this.backgroundMusicVolume = parseFloat(backgroundMusicVol);
        if (soundEffectVol !== null) this.soundEffectVolume = parseFloat(soundEffectVol);
    },

    saveSettings() {
        cc.sys.localStorage.setItem('background_music_volume', this.backgroundMusicVolume);
        cc.sys.localStorage.setItem('sound_effect_volume', this.soundEffectVolume);
    },

    playDefaultMusic() {
        if (this.musicClips.length > 0) {
            this.playMusic(this.musicClips[0].name, true, true);
        }
    },

    preloadAudio(audioUrl, callback) {
        cc.resources.load(audioUrl, cc.AudioClip, (err, clip) => {
            if (err) {
                console.error('Failed to preload audio:', audioUrl, err);
                return;
            }
            
            if (callback) callback(clip);
        });
    },


});

module.exports = SoundController;