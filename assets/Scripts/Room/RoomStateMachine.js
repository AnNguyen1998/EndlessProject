const StateMachine = require('javascript-state-machine');
const RoomState = require('./RoomState');
const RoomTransition = require('./RoomTransition');

const RoomStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: RoomState.IDLE,
            transitions: [
                { name: RoomTransition.START_LEVEL, from: RoomState.IDLE, to: RoomState.PLAYING },
                { name: RoomTransition.END_GAME, from: RoomState.PLAYING, to: RoomState.ENDED },
                { name: RoomTransition.RESET, from: RoomState.ENDED, to: RoomState.IDLE },
            ],
            methods: {
                onStartLevel: function (lifecycle, chapterNumber) { component.performStartLevel(chapterNumber); },
                onEndGame: function (lifecycle, isWin) { component.performEndGame(isWin); },
                onReset: function () { component.performReset(); },
            },
        });
    },
};

module.exports = RoomStateMachine;