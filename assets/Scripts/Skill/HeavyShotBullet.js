cc.Class({
    extends: cc.Component,

    properties: {
        speed: 1000,
        isOneShot: false,
    },

    update(dt) {
        this.node.x += this.speed * dt;
        if (this.node.x > cc.winSize.width) {
            this.node.destroy();
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group === 'Mob') {
            if (this.isOneShot && other.node.getComponent('MobBase')) {
                other.node.getComponent('MobBase').dieInstantly && other.node.getComponent('MobBase').dieInstantly();
            }
            this.node.destroy();
        }
    },
});