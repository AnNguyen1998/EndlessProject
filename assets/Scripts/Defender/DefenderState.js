const DefenderState = cc.Enum({
    SETUP: 'setup',
    IDLE: 'idle',
    ACTIVE: 'active',
    SHOOTING: 'shooting',
    DAMAGED: 'damaged',
    UPGRADING: 'upgrading',
    OVERLOADED: 'overloaded',
    DESTROYED: 'destroyed',
});
module.exports = DefenderState;