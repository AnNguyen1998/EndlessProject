const PlayerTransition = cc.Enum({
    SPAWNED: 'spawned',
    SHOOT: 'shoot',
    FINISH_SHOOT: 'finishShoot',
    DIE: 'die',
    MOVE: 'move',
});

module.exports = PlayerTransition;