const StateMachine = require('javascript-state-machine');
const GameState = require('./GameState');
const GameTransition = require('./GameTransition');

const GameStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: GameState.UNINITIALIZED,
            transitions: [
                { name: GameTransition.INITIALIZE, from: GameState.UNINITIALIZED, to: GameState.INITIALIZED },
                { name: GameTransition.END, from: GameState.INITIALIZED, to: GameState.ENDED },
            ],
            methods: {
                onInitialize: function () { component.performInit(); },
                onEnd: function () { component.performEnd(); },
            },
        });
    },
};

module.exports = GameStateMachine;