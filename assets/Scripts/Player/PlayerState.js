const PlayerState = cc.Enum({
    SPAWN: 'spawn',
    IDLE: 'idle',
    MOVE: 'move',
    ATTACK: 'attack',
    CAST_SKILL: 'castSkill',
    DAMAGED: 'damaged',
    DEAD: 'dead',
    RESPAWN: 'respawn',
    STUNNED: 'stunned',
    INVINCIBLE: 'invincible',
    DASH: 'dash',
    JUMP: 'jump',
    FALL: 'fall',
    CROUCH: 'crouch',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
});
module.exports = PlayerState;
