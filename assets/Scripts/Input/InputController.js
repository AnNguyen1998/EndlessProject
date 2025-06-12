const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const { SkillEvent } = require("SkillKeys");
class InputController {
    init() {
        this.registerInputEvents();
    }

    registerInputEvents() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                Emitter.instance.emit(PlayerEventKeys.MOVE_UP);
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                Emitter.instance.emit(PlayerEventKeys.MOVE_DOWN);
                break;
            case cc.macro.KEY.space:
                Emitter.instance.emit(PlayerEventKeys.PRE_SHOOT);
                break;
            case cc.macro.KEY.j:
                Emitter.instance.emit(SkillEvent.SKILL_BUTTON_CLICK, 1);
                break;
            case cc.macro.KEY.k:
                Emitter.instance.emit(SkillEvent.SKILL_BUTTON_CLICK, 0);
                break;
        }
    }

    unregisterInputEvents() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    destroy() {
        this.unregisterInputEvents();
    }
}

module.exports = InputController;