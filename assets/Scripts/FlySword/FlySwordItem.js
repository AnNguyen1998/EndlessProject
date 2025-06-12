cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad() {
        this.scheduleOnce(() => {
            this.init();
        }, 0);
    },

    init() {
        this.isFlying = false;
    },
    onCollisionEnter(other, self) {
        if (other.node.group === 'MobGroup') {
            if (this.isFlying) return;
            const animation = this.node.getComponent(cc.Animation);
            if (animation) {
                animation.stop();
            }
            this.node.scaleX = 1;
            this.node.scaleY = 1;
            this.isFlying = true;
            const targetX = this.node.x + 2000;
            cc.tween(this.node)
                .to(0.5, { position: cc.v2(targetX, this.node.y) }, { easing: "sineInOut" })
                .call(() => {
                    this.node.active = false;
                    cc.tween(this.node).stop();
                })
                .start();
        }
    },

});