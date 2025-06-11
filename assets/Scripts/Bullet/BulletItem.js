cc.Class({
    extends: cc.Component,
    properties: {
        speed: 600,
        damage: 10,
        explosionPrefab: cc.Prefab,
        _isPiercing: false,
        _controller: null,
    },

    unuse() {
        this.node.active = false;
        this._controller = null;
        console.log('Bullet unuse, deactivating node');

    },

    reuse(controller, options) {
        console.log('Bullet reuse, activating node with options:', options);

        this.node.active = true;
        this._controller = controller;
        this.damage = options.damage || 10;
        this._isPiercing = options.isPiercing || false;
    },


    update(dt) {
        this.node.x += this.speed * dt;
        if (this.node.x > 1600) {
            if (this._controller) {
                this._controller.recycleBullet(this.node);
                console.log('Bullet out of bounds, recycling bullet');

            }
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group === "MobGroup") {
            this.createExplosionEffect();

            if (!this._isPiercing) {
                if (this._controller) {
                    this._controller.recycleBullet(this.node);
                    console.log('Bullet hit mob, recycling bullet');

                }
            }
        }
    },

    createExplosionEffect() {
        if (!this.explosionPrefab) return;

        const effectLayer = cc.find('Canvas/GameArea');
        if (!effectLayer) return;

        const effect = cc.instantiate(this.explosionPrefab);
        effect.parent = effectLayer;
        effect.position = this.node.position;
    }
});