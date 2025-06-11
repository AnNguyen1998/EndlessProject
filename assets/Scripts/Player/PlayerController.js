cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        jumpHeight: 0,
        jumpDuration: 0,
        groundLayer: cc.Layer,
    },
    onLoad() {
        this.init();
    },
    init() {
        this.isJumping = false;
        this.isMoving = false;
        this.direction = cc.v2(0, 0);
        this.node.setPosition(cc.v2(0, 0));
        this.node.setAnchorPoint(0.5, 0);
    },
});