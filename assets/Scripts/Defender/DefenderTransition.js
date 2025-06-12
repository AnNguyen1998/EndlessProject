const DefenderTransition = cc.Enum({
    FINISH_SETUP: 'finishSetup',
    ACTIVATE: 'activate',
    START_SHOOTING: 'startShooting',
    STOP_SHOOTING: 'stopShooting',
    TAKE_DAMAGE: 'takeDamage',
    REPAIR: 'repair',
    UPGRADE: 'upgrade',
    FINISH_UPGRADE: 'finishUpgrade',
    OVERLOAD: 'overload',
    COOLDOWN: 'cooldown',
    DEACTIVATE: 'deactivate',
    BE_DESTROY: 'beDestroy',
    RESET: 'reset',
});

module.exports = DefenderTransition;