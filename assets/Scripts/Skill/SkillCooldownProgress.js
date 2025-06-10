const Emitter = require('../EventEmitter/Emitter');
const { Skill } = require('./SkillKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        skill: {
            default: null,
            type: cc.Node, 
        },
        progressSprite: {
            default: null,
            type: cc.Sprite, 
        },
    },

    onLoad() {
        this.registerEvents();
        if (this.progressSprite) {
            this.progressSprite.fillRange = 0;
            this.progressSprite.node.active = false;
        }
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
        // Lấy component skill từ node nếu cần
        let skillComponent = this.getSkillComponent();
        if (!skillComponent) {
            console.log("No skill component found");
            return;
        }
        
        console.log("Progress bar: skillIndex from event:", skillIndex, "skill component index:", skillComponent.skillIndex);
        
        if (skillComponent.skillIndex !== skillIndex) return;
        
        console.log("Progress bar cooldown started for skill:", skillIndex);
        this.progressSprite.node.active = true;
        this.startProgressUpdate();
    },

    onSkillCooldownEnd(skillIndex) {
        let skillComponent = this.getSkillComponent();
        if (!skillComponent) return;
        
        if (skillComponent.skillIndex !== skillIndex) return;
        
        console.log("Progress bar cooldown ended for skill:", skillIndex);
        this.progressSprite.node.active = false;
        this.stopProgressUpdate();
    },

    getSkillComponent() {
        if (!this.skill) return null;
        
        // // Nếu skill là component, trả về trực tiếp
        // if (this.skill.skillIndex !== undefined) {
        //     return this.skill;
        // }
        
        // Nếu skill là node, lấy component HeavyShotBulletSkill
        if (this.skill.node || this.skill.getComponent) {
            return this.skill.getComponent('SkillItem');
        }
        
        return null;
    },

    startProgressUpdate() {
        this.stopProgressUpdate();
        this.schedule(() => {
            this.updateProgress();
        }, 0.016); 
    },

    stopProgressUpdate() {
        this.unscheduleAllCallbacks();
    },

    updateProgress() {
        if (!this.skill || !this.progressSprite) {
            console.log("Missing skill or progressSprite");
            return;
        }
        
        let skillComponent = this.getSkillComponent();
        if (!skillComponent || !skillComponent.fsm) {
            console.log("Skill component or fsm not found");
            return;
        }
        
        if (skillComponent.fsm.state === 'cooldown') {
            let percent = skillComponent._cooldownTimer / skillComponent.cooldown;
            this.progressSprite.fillRange = percent;
            console.log("Progress updated:", percent);
        } else {
            this.stopProgressUpdate();
            this.progressSprite.node.active = false;
        }
    },
});