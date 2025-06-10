const Emitter = require('../EventEmitter/Emitter');
const { Skill } = require('./SkillKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        skills: {
            default: [],
            type: [cc.Component], // Các skill components
        },
        skillButtons: {
            default: [],
            type: [cc.Button], // Các button skill tương ứng
        },
    },

    onLoad() {
        this.initSkills();
        this.registerButtonEvents();
    },

    onDestroy() {
        this.unregisterButtonEvents();
        this.cleanupSkills();
    },

    initSkills() {
        for (let i = 0; i < this.skills.length; i++) {
            if (this.skills[i]) {
                this.skills[i].skillIndex = i;
            }
        }
    },

    cleanupSkills() {
        for (let i = 0; i < this.skills.length; i++) {
            if (this.skills[i]) {
                this.skills[i].disable();
            }
        }
    },

    registerButtonEvents() {
        for (let i = 0; i < this.skillButtons.length; i++) {
            if (this.skillButtons[i]) {
                this.skillButtons[i].node.on('click', () => this.onSkillButtonClick(i), this);
            }
        }
    },

    unregisterButtonEvents() {
        for (let i = 0; i < this.skillButtons.length; i++) {
            if (this.skillButtons[i]) {
                this.skillButtons[i].node.off('click', () => this.onSkillButtonClick(i), this);
            }
        }
    },

    onSkillButtonClick(index) {
        Emitter.instance.emit(Skill.SKILL_BUTTON_CLICK, index);
    },

    getSkill(index) {
        return this.skills[index] || null;
    },

    getAllSkills() {
        return this.skills;
    },
});
