const StateMachine = require('javascript-state-machine');
const PlayerState = require('./PlayerState');
const PlayerTransition = require('./PlayerTransition');
const PlayerStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: PlayerState.SPAWN,
            transitions: [
                { name: PlayerTransition.SPAWNED, from: PlayerState.SPAWN, to: PlayerState.IDLE },
                { name: PlayerTransition.START_MOVE, from: [PlayerState.IDLE, PlayerState.STAND_UP], to: PlayerState.MOVE },
                { name: PlayerTransition.STOP_MOVE, from: PlayerState.MOVE, to: PlayerState.IDLE },
                { name: PlayerTransition.START_ATTACK, from: [PlayerState.IDLE, PlayerState.MOVE, PlayerState.STAND_UP], to: PlayerState.ATTACK },
                { name: PlayerTransition.STOP_ATTACK, from: PlayerState.ATTACK, to: PlayerState.IDLE },
                { name: PlayerTransition.TAKE_DAMAGE, from: [PlayerState.IDLE, PlayerState.MOVE, PlayerState.ATTACK, PlayerState.DASH, PlayerState.JUMP, PlayerState.FALL, PlayerState.CROUCH], to: PlayerState.DAMAGED },
                { name: PlayerTransition.RECOVER, from: PlayerState.DAMAGED, to: PlayerState.IDLE },
                { name: PlayerTransition.DIE, from: [PlayerState.IDLE, PlayerState.MOVE, PlayerState.ATTACK, PlayerState.DAMAGED, PlayerState.STUNNED, PlayerState.DASH, PlayerState.JUMP, PlayerState.FALL, PlayerState.CROUCH], to: PlayerState.DEAD },
                { name: PlayerTransition.RESPAWN, from: PlayerState.DEAD, to: PlayerState.RESPAWN },
                { name: PlayerTransition.SPAWNED, from: PlayerState.RESPAWN, to: PlayerState.IDLE },
                { name: PlayerTransition.STUN, from: [PlayerState.IDLE, PlayerState.MOVE, PlayerState.ATTACK, PlayerState.DAMAGED], to: PlayerState.STUNNED },
                { name: PlayerTransition.RECOVER, from: PlayerState.STUNNED, to: PlayerState.IDLE },
                { name: PlayerTransition.BECOME_INVINCIBLE, from: [PlayerState.IDLE, PlayerState.MOVE, PlayerState.ATTACK], to: PlayerState.INVINCIBLE },
                { name: PlayerTransition.LOSE_INVINCIBLE, from: PlayerState.INVINCIBLE, to: PlayerState.IDLE },
                { name: PlayerTransition.DASH, from: [PlayerState.IDLE, PlayerState.MOVE], to: PlayerState.DASH },
                { name: PlayerTransition.FINISH_DASH, from: PlayerState.DASH, to: PlayerState.IDLE },
                { name: PlayerTransition.JUMP, from: [PlayerState.IDLE, PlayerState.MOVE, PlayerState.DASH], to: PlayerState.JUMP },
                { name: PlayerTransition.FALL, from: PlayerState.JUMP, to: PlayerState.FALL },
                { name: PlayerTransition.LAND, from: [PlayerState.FALL, PlayerState.JUMP], to: PlayerState.IDLE },
                { name: PlayerTransition.CROUCH, from: [PlayerState.IDLE, PlayerState.MOVE], to: PlayerState.CROUCH },
                { name: PlayerTransition.STAND_UP, from: PlayerState.CROUCH, to: PlayerState.IDLE },
                { name: PlayerTransition.WIN, from: '*', to: PlayerState.VICTORY },
                { name: PlayerTransition.LOSE, from: '*', to: PlayerState.DEFEAT },
            ],
            methods: {
                onSpawned() { component.onSpawned(); },
                onStartMove() { component.onStartMove(); },
                onStopMove() { component.onStopMove(); },
                onStartAttack() { component.onStartAttack(); },
                onStopAttack() { component.onStopAttack(); },
                onTakeDamage() { component.onTakeDamage(); },
                onRecover() { component.onRecover(); },
                onDie() { component.onDie(); },
                onRespawn() { component.onRespawn(); },
                onStun() { component.onStun(); },
                onBecomeInvincible() { component.onBecomeInvincible(); },
                onLoseInvincible() { component.onLoseInvincible(); },
                onDash() { component.onDash(); },
                onFinishDash() { component.onFinishDash(); },
                onJump() { component.onJump(); },
                onFall() { component.onFall(); },
                onLand() { component.onLand(); },
                onCrouch() { component.onCrouch(); },
                onStandUp() { component.onStandUp(); },
                onWin() { component.onWin(); },
                onLose() { component.onLose(); },
            },
        });
    },
};
module.exports = PlayerStateMachine;
