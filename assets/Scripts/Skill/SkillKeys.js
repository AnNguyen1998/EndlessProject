export const SkillEvent = cc.Enum({
    SKILL_BUTTON_CLICK: 'skillButtonClick',
    SKILL_ACTIVATED: 'skillActivated',
    SKILL_DEACTIVATED: 'skillDeactivated',
    SKILL_COOLDOWN_START: 'skillCooldownStart',
    SKILL_COOLDOWN_END: 'skillCooldownEnd',
    HEAVY_SHOT_FIRED: 'heavyShotFired',
    GATLING_SHOT_FIRED: 'gatlingShotFired',
});

export const SkillInternalEvent = cc.Enum({
    CLICK : 'click',
});

export const SkillState = cc.Enum({
    IDLE: 'idle',
    ACTIVE: 'active',
    COOLDOWN: 'cooldown',
    DISABLED: 'disabled',
});

export const SkillAction = cc.Enum({
    ACTIVATE: 'activate',
    DEACTIVATE: 'deactivate',
    COOLDOWN_END: 'cooldownEnd',
    DISABLE: 'disable',
    ENABLE: 'enable',
});