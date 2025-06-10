const StateMachine = require('javascript-state-machine');
const Emitter = require('../EventEmitter/Emitter');
const { Skill } = require('../EventEmitter/EventKeys');

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
        isActive: {
            default: false,
            visible: false,
        },
        _cooldownTimer: 0,
    },

    onLoad() {
        this.init();
        this.registerEvents();
    },

    onDestroy() {
        this.unregisterEvents();
    },

    init(){
        this._cooldownTimer = 0;
        this.isActive = false;
        this._initStateMachine();
    },

    registerEvents() {
        Emitter.instance.registerEvent(Skill.SKILL_BUTTON_CLICK, this.onSkillButtonClick.bind(this));
    },

    unregisterEvents() {
        Emitter.instance.removeEvent(Skill.SKILL_BUTTON_CLICK, this.onSkillButtonClick.bind(this));
    },

    onSkillButtonClick(skillIndex) {
        if (skillIndex === this.skillIndex && this.canUse()) {
            this.activate();
        }
    },

    _initStateMachine() {
        this.fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'activate', from: 'idle', to: 'active' },
                { name: 'deactivate', from: 'active', to: 'cooldown' },
                { name: 'cooldownEnd', from: 'cooldown', to: 'idle' },
                { name: 'disable', from: '*', to: 'disabled' },
                { name: 'enable', from: 'disabled', to: 'idle' },
            ],
            methods: {
                onActivate: () => {
                    this.isActive = true;
                    this.onActivate();
                    Emitter.instance.emit(Skill.SKILL_ACTIVATED, this.skillIndex);
                    this.scheduleOnce(this._onDurationEnd, this.duration);
                },
                onDeactivate: () => {
                    this.isActive = false;
                    this.onDeactivate();
                    this._cooldownTimer = this.cooldown;
                    Emitter.instance.emit(Skill.SKILL_DEACTIVATED, this.skillIndex);
                    Emitter.instance.emit(Skill.SKILL_COOLDOWN_START, this.skillIndex);
                },
                onCooldownEnd: () => {
                    Emitter.instance.emit(Skill.SKILL_COOLDOWN_END, this.skillIndex);
                },
                onDisable: () => {
                    this.unscheduleAllCallbacks();
                    this.isActive = false;
                },
                onEnable: () => {},
            },
        });
    },

    update(dt) {
        if (!this.fsm) return;
        if (this.fsm.state === 'cooldown') {
            if (this._cooldownTimer > 0) {
                this._cooldownTimer -= dt;
                if (this._cooldownTimer <= 0) {
                    this._cooldownTimer = 0;
                    this.fsm.cooldownEnd();
                }
            }
        }
    },

    canUse() {
        return this.fsm.state === 'idle';
    },

    activate() {
        if (!this.canUse()) return false;
        this.fsm.activate();
        return true;
    },

    _onDurationEnd() {
        if (this.fsm.state === 'active') {
            this.fsm.deactivate();
        }
    },

    deactivate() {
        if (this.fsm.state !== 'active') return;
        this.fsm.deactivate();
    },

    disable() {
        if (this.fsm.state !== 'disabled') {
            this.fsm.disable();
        }
    },

    enable() {
        if (this.fsm.state === 'disabled') {
            this.fsm.enable();
        }
    },

    onActivate() {
        // Custom skill logic here
        console.log(`${this.skillName} activated!`);
    },

    onDeactivate() {
        console.log(`${this.skillName} deactivated!`);
        // Custom logic when skill ends
    },
});