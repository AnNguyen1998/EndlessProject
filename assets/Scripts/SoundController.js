const mEmitter = require('./EventEmitter/Emitter');
import { Popup, Game, Player, Monster } from './EventEmitter/EventKeys';

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
        cc.game.addPersistRootNode(this.node);

        this.currentMusicId = -1;
        this.musicClipMap = new Map();
        this.soundClipMap = new Map();
        
        this.loadSettings();
        
        this.setupAudioClips();
        
        this.registerEvents();
        
        this.playDefaultMusic();

        console.log('SoundController initialized');
        console.log(`Volume Settings - Background Music: ${this.backgroundMusicVolume}, Sound Effect: ${this.soundEffectVolume}`);
    },

    onDestroy() {
        mEmitter.instance.removeEventsMap(this.eventMap);
        this.stopMusic();
        this.stopAllSoundEffects();
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
        this.eventMap = {
            [Popup.CHANGED_SLIDER]: this.onVolumeChanged.bind(this),
            [Game.START_GAME]: this.onGameStart.bind(this),
            [Game.END_GAME]: this.onGameEnd.bind(this),
            [Game.PAUSE_GAME]: this.onGamePause.bind(this),
            [Game.RESUME_GAME]: this.onGameResume.bind(this),
            [Player.JUMP]: () => this.playSoundEffect('jump'),
            [Player.ATTACK]: () => this.playSoundEffect('attack'),
            [Monster.MONSTER_DIE]: () => this.playSoundEffect('monster_die'),
            [Monster.MONSTER_HIT]: () => this.playSoundEffect('monster_hit'),
        };
        mEmitter.instance.registerEventsMap(this.eventMap);
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
    },

    setSoundEffectVolume(volume) {
        this.soundEffectVolume = cc.misc.clampf(volume, 0, 1);
        cc.audioEngine.setEffectsVolume(this.soundEffectVolume);
        this.saveSettings();
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
        this.playMusic('bgm', true, true);
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
        const backgroundMusicVol = cc.sys.localStorage.getItem('background_music_volume');
        const soundEffectVol = cc.sys.localStorage.getItem('sound_effect_volume'); 

        if (backgroundMusicVol !== null) this.backgroundMusicVolume = parseFloat(backgroundMusicVol);
        if (soundEffectVol !== null) this.soundEffectVolume = parseFloat(soundEffectVol);
    },

    saveSettings() {
        cc.sys.localStorage.setItem('bgm_volume', this.backgroundMusicVolume);
        cc.sys.localStorage.setItem('sfx_volume', this.soundEffectVolume);
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