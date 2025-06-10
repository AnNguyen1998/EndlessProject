const Emitter = require('../EventEmitter/Emitter');
const { Skill } = require('./SkillKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        // Separate arrays thay vì array of objects
        skillComponents: {
            default: [],
            type: [cc.Component], // Skill components (ví dụ: HeavyShotBulletSkill)
        },
        skillButtons: {
            default: [],
            type: [cc.Button], // Button UI tương ứng
        },
        progressSprites: {
            default: [],
            type: [cc.Sprite], // Progress bar sprites (Filled, Radial)
        },
        progressNodes: {
            default: [],
            type: [cc.Node], // Nodes chứa progress bars
        },
    },

    onLoad() {
        this.initSkills();
        this.registerEvents();
        this.setupUI();
    },

    onDestroy() {
        this.unregisterEvents();
        this.cleanupSkills();
    },

    initSkills() {
        // Khởi tạo index cho từng skill và cache button states
        for (let i = 0; i < this.skillComponents.length; i++) {
            const skill = this.skillComponents[i];
            if (skill) {
                skill.skillIndex = i;
            }
            
            // Cache original button states
            const button = this.skillButtons[i];
            if (button) {
                // Store trong skill object để dễ truy cập
                skill._originalTransition = button.transition;
                skill._originalScale = button.node.scale;
            }
        }
    },

    setupUI() {
        // Setup button events và initial progress bar states
        for (let i = 0; i < this.skillButtons.length; i++) {
            const button = this.skillButtons[i];
            if (button) {
                button.node.on('click', () => this.onSkillButtonClick(i), this);
            }
            
            // Setup initial progress bar state
            const progressSprite = this.progressSprites[i];
            const progressNode = this.progressNodes[i];
            
            if (progressSprite) {
                progressSprite.fillRange = 0;
                // if (progressNode) {
                //     progressNode.active = false;
                // }
            }
        }
    },

    cleanupSkills() {
        // Dọn dẹp button events và disable skills
        for (let i = 0; i < this.skillButtons.length; i++) {
            const button = this.skillButtons[i];
            if (button) {
                button.node.off('click', () => this.onSkillButtonClick(i), this);
            }
        }
        
        for (let i = 0; i < this.skillComponents.length; i++) {
            const skill = this.skillComponents[i];
            if (skill && skill.disable) {
                skill.disable();
            }
        }
    },

    registerEvents() {
        Emitter.instance.registerEvent(Skill.SKILL_COOLDOWN_START, this.onSkillCooldownStart.bind(this));
        Emitter.instance.registerEvent(Skill.SKILL_COOLDOWN_END, this.onSkillCooldownEnd.bind(this));
    },

    unregisterEvents() {
        Emitter.instance.removeEvent(Skill.SKILL_COOLDOWN_START, this.onSkillCooldownStart.bind(this));
        Emitter.instance.removeEvent(Skill.SKILL_COOLDOWN_END, this.onSkillCooldownEnd.bind(this));
    },

    onSkillButtonClick(index) {
        Emitter.instance.emit(Skill.SKILL_BUTTON_CLICK, index);
    },

    onSkillCooldownStart(skillIndex) {
        if (skillIndex >= this.skillComponents.length) return;

        this.setButtonState(skillIndex, false);
        
        this.startProgressBar(skillIndex);
    },

    onSkillCooldownEnd(skillIndex) {
        if (skillIndex >= this.skillComponents.length) return;

        this.setButtonState(skillIndex, true);
        
        this.stopProgressBar(skillIndex);
    },

    setButtonState(skillIndex, enabled) {
        const button = this.skillButtons[skillIndex];
        const skill = this.skillComponents[skillIndex];
        if (!button || !skill) return;
        
        button.interactable = enabled;
        
        if (enabled) {
            button.transition = skill._originalTransition || cc.Button.Transition.SCALE;
            button.node.opacity = 255;
            button.node.scale = skill._originalScale || 1;
        } else {
            button.transition = cc.Button.Transition.NONE;
            button.node.opacity = 150; // Dim button
        }
    },

    startProgressBar(skillIndex) {
        const progressSprite = this.progressSprites[skillIndex];
        const progressNode = this.progressNodes[skillIndex];
        const skill = this.skillComponents[skillIndex];
        
        if (!progressSprite || !skill) return;
        
        // if (progressNode) {
        //     progressNode.active = true;
        // }
        
        this.stopProgressBar(skillIndex); // Clear any existing timer
        skill._progressTimer = setInterval(() => {
            this.updateProgress(skillIndex);
        }, 16); // 60 FPS
    },

    stopProgressBar(skillIndex) {
        const progressSprite = this.progressSprites[skillIndex];
        const progressNode = this.progressNodes[skillIndex];
        const skill = this.skillComponents[skillIndex];
        
        if (skill && skill._progressTimer) {
            clearInterval(skill._progressTimer);
            skill._progressTimer = null;
        }
        
        // if (progressNode) {
        //     progressNode.active = false;
        // }
        
        if (progressSprite) {
            progressSprite.fillRange = 0;
        }
    },

    updateProgress(skillIndex) {
        const progressSprite = this.progressSprites[skillIndex];
        const skill = this.skillComponents[skillIndex];
        
        if (!progressSprite || !skill) return;
        
        if (!skill.fsm || skill.fsm.state !== 'cooldown') {
            this.stopProgressBar(skillIndex);
            return;
        }
        
        const percent = skill._cooldownTimer / skill.cooldown;
        progressSprite.fillRange = percent;
    },

    getSkill(index) {
        return this.skillComponents[index] || null;
    },

    getAllSkills() {
        return this.skillComponents.filter(skill => skill);
    },
});
