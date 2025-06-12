const PlayerStateMachine = require('./PlayerStateMachine');
const PlayerState = require('./PlayerState');
const InputController = require("../Input/InputController");
const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const PlayerData = require('PlayerTemplate');
const PlayerTransition = require('./PlayerTransition');
cc.Class({
    extends: cc.Component,
    properties: {
        playerItem: require('./PlayerItem'),
        spine: sp.Skeleton,
        laneCount: 3,
        moveDuration: 0.1,
        _currentLaneIndex: 1,
        _lanePositionsY: [],
        lastShootTime: 0,
        shootInterval: 1, // Adjust as needed
    },

    onLoad() {
        PlayerData.load();
        this.init();
        this.shootInterval = PlayerData.getAttribute('attackSpeed').value;
    },

    init() {
        this.fsm = PlayerStateMachine.createStateMachine(this);
        this.inputController = new InputController();
        this.inputController.init();

        this.calculateLanePositions();
        this.node.y = this._lanePositionsY[this._currentLaneIndex];
        this.node.x += 100; // Adjust initial X position if needed
        this.spine.setCompleteListener((trackEntry) => {
            const animationName = trackEntry.animation ? trackEntry.animation.name : '';
            if (animationName === 'portal') {
                this.fsm.spawned();
            } else if (animationName === 'shoot') {
                this.fsm.finishShoot();
            }
        });

        this.eventMap = {
            [PlayerEventKeys.MOVE_UP]: this.onMoveUp.bind(this),
            [PlayerEventKeys.MOVE_DOWN]: this.onMoveDown.bind(this),
            [PlayerEventKeys.PRE_SHOOT]: this.onPreShoot.bind(this),
            // [PlayerEventKeys.HEAVY_SHOT]: this.onShoot.bind(this),
            // [PlayerEventKeys.TRIPLE_SHOT]: this.onShoot.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);

        this.handleAnimation();
    },

    onPreShoot() {
        if (this.fsm.can('shoot')) {
            const currentTime = Date.now();
            // console.log(`Current time: ${currentTime}, Last shoot time: ${this.lastShootTime}, Shoot interval: ${this.shootInterval}`);
            
            if (currentTime - this.lastShootTime >= this.shootInterval * 1000) {
                // this.fsm.shoot();
                Emitter.instance.emit(PlayerEventKeys.SHOOT);
                this.lastShootTime = currentTime;
            } else {
                // console.log(`Cannot shoot yet. Time remaining: ${((this.shootInterval * 1000) - (currentTime - this.lastShootTime)) / 1000} seconds`);
            }
        }
    },

    onDestroy() {
        if (this.inputController) {
            this.inputController.destroy();
        }
        Emitter.instance.removeEventsMap(this.eventMap);
    },

    calculateLanePositions() {
        const startY = 70;
        const endY = 450;
        const step = (endY - startY) / (this.laneCount - 1);
        for (let i = 0; i < this.laneCount; i++) {
            this._lanePositionsY.push(startY + i * step);
        }
    },

    onMoveUp() {
        if (!this.fsm.can('move')) return;
        if (this._currentLaneIndex >= this.laneCount - 1) return;

        this._currentLaneIndex++;
        this.moveToLane(this._currentLaneIndex);
    },

    onMoveDown() {
        if (!this.fsm.can('move')) return;
        if (this._currentLaneIndex <= 0) return;

        this._currentLaneIndex--;
        this.moveToLane(this._currentLaneIndex);
    },

    moveToLane(laneIndex) {
        const targetY = this._lanePositionsY[laneIndex];
        cc.tween(this.node)
            .to(this.moveDuration, { position: cc.v2(this.node.x, targetY) })
            .start();
    },

    onShoot() {
        if (this.fsm.can('shoot')) {
            this.fsm.shoot();
        }
    },

    handleAnimation() {
        switch (this.fsm.state) {
            case PlayerState.SPAWN:
                this.playAnim('portal', false);
                break;
            case PlayerState.IDLE:
                this.playAnim('hoverboard', true);
                break;
            case PlayerState.DEAD:
                this.playAnim('death', false);
                break;
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group === "MobGroup") {
            if (this.fsm.can(PlayerTransition.DIE)) {
                this.fsm.die();
            }
        }
    },

    playAnim(animName, loop) {
        if (this.spine && this.spine.animation !== animName) {
            this.spine.setAnimation(0, animName, loop);
        }
    },

    onSpawned() {
        this.handleAnimation();
    },

    onStartShoot() {
        // this.spine.setAnimation(1, 'shoot', false);
        // this.spine.addAnimation(0, 'hoverboard', true);
    },

    onFinishShoot() {
        this.handleAnimation();
    },

    onDie() {
        this.handleAnimation();
    },
});