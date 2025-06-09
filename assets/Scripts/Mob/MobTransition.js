const MobTransition = cc.Enum({
    SPAWN: 'spawn',
    ATTACK: 'attack',
    MOVE: 'move',
    TAKE_DAMAGE: 'takeDamage',
    STUN: 'stun',
    FREEZE: 'freeze',
    BURN: 'burn',
    POISON: 'poison',
    HEAL: 'heal',
    RECOVER: 'recover',
    DIE: 'die',
    DEAD: 'dead',
    OUT_OF_SCREEN: 'outOfScreen',
    RESET: 'reset',
});

module.exports = MobTransition;