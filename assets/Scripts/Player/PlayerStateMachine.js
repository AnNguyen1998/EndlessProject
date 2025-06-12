const StateMachine = require('javascript-state-machine');
const PlayerState = require('./PlayerState');
const PlayerTransition = require('./PlayerTransition');

const PlayerStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: PlayerState.SPAWN,
            transitions: [
                { name: PlayerTransition.SPAWNED, from: PlayerState.SPAWN, to: PlayerState.IDLE },
                { name: PlayerTransition.SHOOT, from: PlayerState.IDLE, to: PlayerState.SHOOT },
                { name: PlayerTransition.FINISH_SHOOT, from: PlayerState.SHOOT, to: PlayerState.IDLE },
                { name: PlayerTransition.DIE, from: [PlayerState.IDLE, PlayerState.SHOOT], to: PlayerState.DEAD },
                { name: PlayerTransition.MOVE, from: PlayerState.IDLE, to: PlayerState.IDLE },
            ],
            methods: {
                onSpawned: function () { component.onSpawned(); },
                onShoot: function () { component.onStartShoot(); },
                onFinishShoot: function () { component.onFinishShoot(); },
                onDie: function () { component.onDie(); },
            },
        });
    },
};

module.exports = PlayerStateMachine;