const StateMachine = require('javascript-state-machine');
const MobState = require('./MobState');
const MobTransition = require('./MobTransition');
const MobStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: 'idle',
            transitions: [
                { name: MobTransition.SPAWN, from: MobState.IDLE, to: MobState.MOVING },
                { name: MobTransition.ATTACK, from: MobState.MOVING, to: MobState.ATTACKING },
                { name: MobTransition.MOVE, from: [MobState.ATTACKING], to: MobState.MOVING },
                { name: MobTransition.TAKE_DAMAGE, from: [MobState.MOVING, MobState.ATTACKING], to: MobState.HURT },
                { name: MobTransition.STUN, from: [MobState.MOVING, MobState.ATTACKING], to: MobState.STUNNED },
                { name: MobTransition.FREEZE, from: [MobState.MOVING, MobState.ATTACKING], to: MobState.FROZEN },
                { name: MobTransition.BURN, from: [MobState.MOVING, MobState.ATTACKING], to: MobState.BURNING },
                { name: MobTransition.POISON, from: [MobState.MOVING, MobState.ATTACKING], to: MobState.POISONED },
                { name: MobTransition.HEAL, from: [MobState.HURT, MobState.POISONED, MobState.BURNING], to: MobState.HEALING },
                { name: MobTransition.RECOVER, from: [MobState.HURT, MobState.STUNNED, MobState.FROZEN, MobState.HEALING], to: MobState.MOVING },
                { name: MobTransition.DIE, from: [MobState.HURT, MobState.POISONED, MobState.BURNING, MobState.MOVING, MobState.ATTACKING], to: MobState.DYING },
                { name: MobTransition.DEAD, from: MobState.DYING, to: MobState.DEAD },
                { name: MobTransition.OUT_OF_SCREEN, from: [MobState.MOVING, MobState.ATTACKING], to: MobState.OUT_OF_SCREEN },
                { name: MobTransition.RESET, from: [MobState.DEAD, MobState.OUT_OF_SCREEN], to: MobState.IDLE },
            ],
            methods: {
                onSpawn() { component.onSpawn(); },
                onMove(dt) { component.onMove(dt); },
                onAttack() { component.onAttack(); },
                onTakeDamage() { component.onTakeDamage(); },
                onStun() { component.onStun(); },
                onFreeze() { component.onFreeze(); },
                onBurn() { component.onBurn(); },
                onPoison() { component.onPoison(); },
                onHeal() { component.onHeal(); },
                onRecover() { component.onRecover(); },
                onDie() { component.onDie(); },
                onDead() { component.onDead(); },
                onOutOfScreen() { component.onOutOfScreen(); },
                onReset() { component.onReset(); },
            },
        });
    },
};

module.exports = MobStateMachine;
