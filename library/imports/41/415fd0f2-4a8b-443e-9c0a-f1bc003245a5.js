"use strict";
cc._RF.push(module, '415fdDySotEPpwK8bwAMkWl', 'EventsKey');
// Scripts/EventEmitter/EventsKey.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Popup = exports.Popup = {
    SHOW_SETTING_POPUP: 'showSetting',
    SHOW_RANK_POPUP: 'showRank',
    HIDE_SETTING_POPUP: 'hideSetting',
    HIDE_RANK_POPUP: 'hideRank',
    CHANGED_SLIDER: 'changedSlider',
    TOGGLE_MUSIC: 'toggleMusic',
    TOGGLE_SOUNDFX: 'toggleSound'
};

var Game = exports.Game = {
    START_GAME: 'startGame',
    END_GAME: 'endGame',
    PAUSE_GAME: 'pauseGame',
    RESUME_GAME: 'resumeGame',
    RESTART_GAME: 'restartGame',
    GAME_OVER: 'gameOver'
};

var Player = exports.Player = {
    MOVE_LEFT: 'moveLeft',
    MOVE_RIGHT: 'moveRight',
    MOVE_UP: 'moveUp',
    MOVE_DOWN: 'moveDown',
    ATTACK: 'attack',
    JUMP: 'jump'
};

var Monster = exports.Monster = {
    SPAWN_MONSTER: 'spawnMonster',
    KILL_MONSTER: 'killMonster',
    MONSTER_ATTACK: 'monsterAttack',
    MONSTER_MOVE: 'monsterMove',
    MONSTER_DIE: 'monsterDie',
    MONSTER_HIT: 'monsterHit'
};

cc._RF.pop();