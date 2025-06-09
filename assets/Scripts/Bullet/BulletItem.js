cc.Class({
    extends: cc.Component,
    properties: {
        speed: 600,
        damage: 10,
        explosionPrefab: cc.Prefab,
        target: null
    },

    update(dt) {
        let currentWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let newWorldX = currentWorldPos.x + this.speed * dt;
        let newWorldPos = cc.v2(newWorldX, currentWorldPos.y);
        let newLocalPos = this.node.parent.convertToNodeSpaceAR(newWorldPos);
        this.node.setPosition(newLocalPos);
        if (newWorldX > 1600) {
            this.node.destroy();
        }
        if (this.target && this.target.active) {
            let targetWorldPos = this.target.convertToWorldSpaceAR(cc.v2(0, 0));
            if (newWorldX >= targetWorldPos.x) {
            }
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group === "MobGroup") {
            let mobComp = other.node.getComponent("MobItem");
            if (mobComp) {
                mobComp.takeDamage(this.damage);
            }
            this.createExplosionEffect();
            this.node.destroy();
        }
    },

    createExplosionEffect() {
        if (!this.explosionPrefab) return;

        let bulletWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let effectLayer = cc.find('Canvas/GameArea');
        if (!effectLayer) {
            effectLayer = this.node.parent;
        }

        let effectLocalPos = effectLayer.convertToNodeSpaceAR(bulletWorldPos);
        let effect = cc.instantiate(this.explosionPrefab);
        effect.parent = effectLayer;
        effect.setPosition(effectLocalPos);
    }
});
