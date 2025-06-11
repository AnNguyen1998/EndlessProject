const PlayerStateMachine = require('./PlayerStateMachine');
const PlayerState = require('./PlayerState');
const PlayerTransition = require('./PlayerTransition');
const InputController = require("../Input/InputController");
cc.Class({
    extends: cc.Component,
    properties: {
        playerItem: require('./PlayerItem'),
        anim: sp.Skeleton, // spine
        speed: 200,
        jumpForce: 500,
        isOnGround: true
    },

    onLoad() {
        this.init();
    },

    init() {
        this.fsm = PlayerStateMachine.createStateMachine(this);
        this.curDirection = 0; // -1: left, 1: right, 0: idle
        this.input = { left: false, right: false, up: false, down: false, attack: false, shoot: false };
        this.inputController = new InputController();
        this.inputController.node = this.node;
        this.inputController.init();
    },

    update(dt) {
        this.handleInput();
        this.handleAnimation();
    },

    handleInput() {
        if (this.input.left) {
            this.curDirection = -1;
            if (this.fsm.state !== PlayerState.MOVE) this.fsm.startMove();
            this.node.x -= this.speed * cc.director.getDeltaTime();
        } else if (this.input.right) {
            this.curDirection = 1;
            if (this.fsm.state !== PlayerState.MOVE) this.fsm.startMove();
            this.node.x += this.speed * cc.director.getDeltaTime();
        } else {
            if (this.fsm.state === PlayerState.MOVE) this.fsm.stopMove();
            this.curDirection = 0;
        }

        if (this.input.attack) {
            if (this.fsm.state !== PlayerState.ATTACK) this.fsm.startAttack();
        } else if (this.fsm.state === PlayerState.ATTACK) {
            this.fsm.stopAttack();
        }

        if (this.input.up && this.isOnGround) {
            this.fsm.jump();
            // Thực hiện nhảy vật lý
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpForce);
            this.isOnGround = false;
        }
    },

    handleAnimation() {
        switch (this.fsm.state) {
            case PlayerState.IDLE:
                this.playAnim('idle');
                break;
            case PlayerState.MOVE:
                this.playAnim('walk');
                break;
            case PlayerState.ATTACK:
                this.playAnim('shoot');
                break;
            case PlayerState.JUMP:
                this.playAnim('jump');
                break;
            case PlayerState.DEAD:
                this.playAnim('death');
                break;
            case PlayerState.DAMAGED:
                this.playAnim('idle-turn');
                break;
            default:
                this.playAnim('idle');
        }
    },

    playAnim(animName) {
        if (this.anim && this.anim.animation !== animName) {
            this.anim.setAnimation(0, animName, true);
        }
    },

    onStartMove() { },
    onStopMove() { },
    onStartAttack() { },
    onStopAttack() { },
    onJump() { },
    onTakeDamage() { },
    onDie() { },
    onRespawn() { },
    onStun() { },
    onRecover() { },
    onBecomeInvincible() { },
    onLoseInvincible() { },
    onDash() { },
    onFinishDash() { },
    onFall() { },
    onLand() { },
    onCrouch() { },
    onStandUp() { },
    onWin() { },
    onLose() { },
});
