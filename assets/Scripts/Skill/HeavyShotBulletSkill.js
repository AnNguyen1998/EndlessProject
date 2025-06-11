const SkillItem = require('Skill/SkillItem');
const Emitter = require('EventEmitter/Emitter');
const { SkillEvent } = require('Skill/SkillKeys');
cc.Class({
    extends: SkillItem,

    properties: {
        skillName: {
            default: 'Heavy Shot',
            override: true,
        },
        cooldown: {
            default: 1,
            override: true,
        },
        duration: {
            default: 0.1,
            override: true,
        }, 
    },
    
    onLoad() {
        this._super();
    },
    onActivate() {
        this._super();
        console.log("Heavy Shot activated");
        Emitter.instance.emit(SkillEvent.HEAVY_SHOT_FIRED, this.skillIndex);
    },
});