const Emitter = require('../EventEmitter/Emitter');
const { SkillEvent } = require('./SkillKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        skills: {
            default: [],
            type: [cc.Component],
        },
    },

    onLoad() {
        this.initSkills();
        this.registerEvents();
    },

    onDestroy() {
        this.unregisterEvents();
        this.cleanupSkills();
    },

    initSkills() {
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            if (skill) {
                skill.skillIndex = i;
            }
        }
    },

    registerEvents() {
    },

    unregisterEvents() {
    },

    onSkillButtonClick(skillIndex) {
        console.log(`Skill ${skillIndex} button clicked`);
    },

    cleanupSkills() {
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            if (skill && skill.disable) {
                skill.disable();
            }
        }
    },

    getSkill(index) {
        return this.skills[index] || null;
    },

    getAllSkills() {
        return this.skills.filter(skill => skill);
    },
});
