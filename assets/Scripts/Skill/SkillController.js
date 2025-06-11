const Emitter = require('../EventEmitter/Emitter');
const { SkillEvent } = require('./SkillKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        skills: {
            default: [],
            type: [cc.Node], 
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

    getSkillComponent(node) {
        let skill = node.getComponent('SkillItem');
        return skill;
    },

    initSkills() {
        for (let i = 0; i < this.skills.length; i++) {
            const skillNode = this.skills[i];
            if (skillNode) {
                const skillComponent = this.getSkillComponent(skillNode);
                if (skillComponent) {
                    skillComponent.skillIndex = i;
                }
            }
        }
    },

    registerEvents() {
        Emitter.instance.registerEvent(SkillEvent.SKILL_BUTTON_CLICK, this.onSkillButtonClick.bind(this));
    },

    unregisterEvents() {
        Emitter.instance.removeEvent(SkillEvent.SKILL_BUTTON_CLICK, this.onSkillButtonClick.bind(this));
    },

    onSkillButtonClick(skillIndex) {
        
        const skillNode = this.skills[skillIndex];

        const skillComponent = this.getSkillComponent(skillNode);

        if (skillComponent.canUse()) {
            skillComponent.activate();
        } 
    },

    cleanupSkills() {
        for (let i = 0; i < this.skills.length; i++) {
            const skillNode = this.skills[i];
            if (skillNode) {
                const skillComponent = this.getSkillComponent(skillNode);
                if (skillComponent && skillComponent.disable) {
                    skillComponent.disable();
                }
            }
        }
    },

    getSkill(index) {
        const skillNode = this.skills[index];
        return skillNode ? this.getSkillComponent(skillNode) : null;
    },

    getAllSkills() {
        return this.skills
            .map(node => node ? this.getSkillComponent(node) : null)
            .filter(skill => skill);
    },
});
