const StateMachine = require('javascript-state-machine');
const Emitter = require('../EventEmitter/Emitter');
const { SkillEvent, SkillState, SkillAction } = require('./SkillKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        skillName: {
            default: '',
            type: cc.String,
        },
        skillIndex: {
            default: 0,
            type: cc.Integer,
        },
        cooldown: {
            default: 3,
            type: cc.Float,
        },
        duration: {
            default: 1,
            type: cc.Float,
        },
        skillButton: {
            default: null,
            type: cc.Button,
        },
        progressSprite: {
            default: null,
            type: cc.Sprite, 
        },
        isActive: {
            default: false,
            visible: false,
        },
        _cooldownTimer: 0,
    },

    onLoad() {
        this.init();
        this.registerEvents();
        this.setupUI();
    },

    onDestroy() {
        this.unregisterEvents();
        this.cleanupUI();
    },

    init() {
        this._cooldownTimer = 0;
        this.isActive = false;
        this._initStateMachine();
    },

    setupUI() {
        if (this.skillButton) {
            this._originalTransition = this.skillButton.transition;
            this._originalScale = this.skillButton.node.scale;
        }

        if (this.progressSprite) {
            this.progressSprite.fillRange = 0;
        }
    },

    cleanupUI() {
        this.stopProgressBar();
    },

    onButtonClick() {
        if (this.canUse()) {
            this.activate();
        }
    },

    registerEvents() {},

    unregisterEvents() {},

    _initStateMachine() {
        this.fsm = new StateMachine({
            init: SkillState.IDLE,
            transitions: [
                { name: SkillAction.ACTIVATE, from: SkillState.IDLE, to: SkillState.ACTIVE },
                { name: SkillAction.DEACTIVATE, from: SkillState.ACTIVE, to: SkillState.COOLDOWN },
                { name: SkillAction.COOLDOWN_END, from: SkillState.COOLDOWN, to: SkillState.IDLE },
                { name: SkillAction.DISABLE, from: '*', to: SkillState.DISABLED },
                { name: SkillAction.ENABLE, from: SkillState.DISABLED, to: SkillState.IDLE },
            ],
            methods: {
                onActivate: () => {
                    this.isActive = true;
                    this.onActivate();
                    this.setButtonState(false); 
                    Emitter.instance.emit(SkillEvent.SKILL_ACTIVATED, this.skillIndex);
                    this.scheduleOnce(this._onDurationEnd, this.duration);
                },
                onDeactivate: () => {
                    this.isActive = false;
                    this.onDeactivate();
                    this._cooldownTimer = this.cooldown;
                    this.startProgressBar(); 
                    Emitter.instance.emit(SkillEvent.SKILL_COOLDOWN_START, this.skillIndex);
                },
                onCooldownEnd: () => {
                    this.setButtonState(true); 
                    this.stopProgressBar(); 
                    Emitter.instance.emit(SkillEvent.SKILL_COOLDOWN_END, this.skillIndex);
                },
                onDisable: () => {
                    this.unscheduleAllCallbacks();
                    this.isActive = false;
                    this.setButtonState(false);
                    this.stopProgressBar();
                },
                onEnable: () => {
                    this.setButtonState(true);
                },
            },
        });
    },

    update(dt) {
        this.updateCooldown(dt);
    },

    updateCooldown(dt) {
        if (!this.fsm) return;
        if (this.fsm.state === SkillState.COOLDOWN) {
            if (this._cooldownTimer > 0) {
                this._cooldownTimer -= dt;
                if (this._cooldownTimer <= 0) {
                    this._cooldownTimer = 0;
                    this.fsm.cooldownEnd();
                }
            }
        }
    },

    startCooldownTimer() {
        this._cooldownInterval = setInterval(() => {
            this.updateCooldown(0.016); 
        }, 16);
        
    },

    stopCooldownTimer() {
        clearInterval(this._cooldownInterval);
        this._cooldownInterval = null;
    },

    canUse() {
        return this.fsm && this.fsm.state === SkillState.IDLE;
    },

    activate() {
        if (!this.canUse()) return false;
        this.fsm.activate();
        return true;
    },

    _onDurationEnd() {
        if (this.fsm && this.fsm.state === SkillState.ACTIVE) {
            this.fsm.deactivate();
        }
    },

    disable() {
        if (this.fsm && this.fsm.state !== SkillState.DISABLED) {
            this.fsm.disable();
        }
    },

    enable() {
        if (this.fsm && this.fsm.state === SkillState.DISABLED) {
            this.fsm.enable();
        }
    },

    setButtonState(enabled) {
        if (!this.skillButton) return;
        
        this.skillButton.interactable = enabled;
        
        if (enabled) {
            this.skillButton.transition = this._originalTransition || cc.Button.Transition.SCALE;
            this.skillButton.node.opacity = 255; 
            this.skillButton.node.scale = this._originalScale || 1;
            
            this.node.opacity = 255;
        } else {
            this.skillButton.transition = cc.Button.Transition.NONE;
            this.skillButton.node.opacity = 100; 
            
            this.node.opacity = 150;
        }
    },

    startProgressBar() {
        if (!this.progressSprite) return;

        this.stopProgressBar(); 
        this._progressTimer = setInterval(() => {
            this.updateProgress();
        }, 16); 
    },

    stopProgressBar() {
        if (this._progressTimer) {
            clearInterval(this._progressTimer);
            this._progressTimer = null;
        }
        
        if (this.progressSprite) {
            this.progressSprite.fillRange = 0;
        }
    },

    updateProgress() {
        if (!this.progressSprite || !this.fsm) return;
        
        if (this.fsm.state !== SkillState.COOLDOWN) {
            this.stopProgressBar();
            return;
        }
        
        const percent = this._cooldownTimer / this.cooldown;
        this.progressSprite.fillRange = percent;
    },

    onActivate() {
    },

    onDeactivate() {
    },
});