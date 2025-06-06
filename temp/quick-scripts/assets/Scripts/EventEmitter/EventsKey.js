(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/EventEmitter/EventsKey.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '415fdDySotEPpwK8bwAMkWl', 'EventsKey', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=EventsKey.js.map
        