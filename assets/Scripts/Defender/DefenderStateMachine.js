const StateMachine = require('javascript-state-machine');
const DefenderState = require('./DefenderState');
const DefenderTransition = require('./DefenderTransition');
const DefenderStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: 'setup',
            transitions: [
                { name: DefenderTransition.FINISH_SETUP, from: DefenderState.SETUP, to: DefenderState.ACTIVE },
                { name: DefenderTransition.ACTIVATE, from: DefenderState.IDLE, to: DefenderState.ACTIVE },
                { name: DefenderTransition.START_SHOOTING, from: DefenderState.ACTIVE, to: DefenderState.SHOOTING },
                { name: DefenderTransition.STOP_SHOOTING, from: DefenderState.SHOOTING, to: DefenderState.ACTIVE },
                { name: DefenderTransition.TAKE_DAMAGE, from: [DefenderState.ACTIVE, DefenderState.SHOOTING], to: DefenderState.DAMAGED },
                { name: DefenderTransition.REPAIR, from: DefenderState.DAMAGED, to: DefenderState.ACTIVE },
                { name: DefenderTransition.UPGRADE, from: [DefenderState.ACTIVE, DefenderState.SHOOTING], to: DefenderState.UPGRADING },
                { name: DefenderTransition.FINISH_UPGRADE, from: DefenderState.UPGRADING, to: DefenderState.ACTIVE },
                { name: DefenderTransition.OVERLOAD, from: DefenderState.SHOOTING, to: DefenderState.OVERLOADED },
                { name: DefenderTransition.COOLDOWN, from: DefenderState.OVERLOADED, to: DefenderState.ACTIVE },
                { name: DefenderTransition.DEACTIVATE, from: [DefenderState.ACTIVE, DefenderState.SHOOTING, DefenderState.DAMAGED, DefenderState.OVERLOADED], to: DefenderState.IDLE },
                { name: DefenderTransition.BE_DESTROY, from: [DefenderState.DAMAGED, DefenderState.ACTIVE, DefenderState.SHOOTING], to: DefenderState.DESTROYED },
                { name: DefenderTransition.RESET, from: DefenderState.DESTROYED, to: DefenderState.IDLE },
            ],
            methods: {
                onActivate() { component.onActivate(); },
                onStartShooting() { component.onStartShooting(); },
                onStopShooting() { component.onStopShooting(); },
                onTakeDamage() { component.onTakeDamage(); },
                onRepair() { component.onRepair(); },
                onUpgrade() { component.onUpgrade(); },
                onFinishUpgrade() { component.onFinishUpgrade(); },
                onOverload() { component.onOverload(); },
                onCooldown() { component.onCooldown(); },
                onDeactivate() { component.onDeactivate(); },
                onDestroy() { component.onDestroy(); },
                onReset() { component.onReset(); },
            },
        });
    },
};

module.exports = DefenderStateMachine;
