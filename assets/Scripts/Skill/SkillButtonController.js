const Emitter = require('../EventEmitter/Emitter');
const { Skill } = require('../EventEmitter/EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        skillIndex: {
            default: 0,
            type: cc.Integer,
        },
        button: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad() {
        this.registerEvents();
        this.originalTransition = this.button.transition;
        this.originalScale = this.node.scale;
    },

    onDestroy() {
        this.unregisterEvents();
    },

    registerEvents() {
        Emitter.instance.registerEvent(Skill.SKILL_COOLDOWN_START, this.onSkillCooldownStart.bind(this));
        Emitter.instance.registerEvent(Skill.SKILL_COOLDOWN_END, this.onSkillCooldownEnd.bind(this));
    },

    unregisterEvents() {
        Emitter.instance.removeEvent(Skill.SKILL_COOLDOWN_START, this.onSkillCooldownStart.bind(this));
        Emitter.instance.removeEvent(Skill.SKILL_COOLDOWN_END, this.onSkillCooldownEnd.bind(this));
    },

    onSkillCooldownStart(skillIndex) {
        if (skillIndex !== this.skillIndex) return;
        
        // Vô hiệu hóa button interaction và hiệu ứng
        this.button.interactable = false;
        this.button.transition = cc.Button.Transition.NONE;
        
        // Có thể thêm hiệu ứng visual để cho thấy button bị disable
        this.node.opacity = 150; // Làm mờ button
    },

    onSkillCooldownEnd(skillIndex) {
        if (skillIndex !== this.skillIndex) return;
        
        // Khôi phục button interaction và hiệu ứng
        this.button.interactable = true;
        this.button.transition = this.originalTransition;
        
        // Khôi phục opacity bình thường
        this.node.opacity = 255;
        this.node.scale = this.originalScale;
    },
});