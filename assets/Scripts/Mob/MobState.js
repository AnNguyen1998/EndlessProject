const MobState = cc.Enum({
    IDLE: 'idle',
    MOVING: 'moving',
    ATTACKING: 'attacking',
    HURT: 'hurt',
    STUNNED: 'stunned',
    FROZEN: 'frozen',
    BURNING: 'burning',
    POISONED: 'poisoned',
    HEALING: 'healing',
    DYING: 'dying',
    DEAD: 'dead',
    OUT_OF_SCREEN: 'outOfScreen',
});

module.exports = MobState;