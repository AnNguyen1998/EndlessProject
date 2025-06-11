const Emitter = require('Emitter');
const { Player: PlayerEventKeys } = require('EventKeys');
const PlayerData = require('PlayerTemplate');

cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: cc.Prefab,
        playerNode: cc.Node,
        bulletPool: null,
    },

    onLoad() {
        this.init();
    },

    init() {
        this.bulletPool = new cc.NodePool('BulletItem');
        const initialBulletCount = 20;
        for (let i = 0; i < initialBulletCount; ++i) {
            let bullet = cc.instantiate(this.bulletPrefab);
            this.bulletPool.put(bullet);
        }

        this.eventMap = {
            [PlayerEventKeys.SHOOT]: this.handleStandardShot.bind(this),
            [PlayerEventKeys.HEAVY_SHOT]: this.handleHeavyShot.bind(this),
            [PlayerEventKeys.TRIPLE_SHOT]: this.handleTripleShot.bind(this),
        };
        Emitter.instance.registerEventsMap(this.eventMap);
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventMap);
        this.bulletPool.clear();
    },

    handleStandardShot() {
        const damage = PlayerData.getAttribute('damage').value;
        this.spawnBullet({ damage: damage, isPiercing: false });
    },

    handleHeavyShot() {
        const damage = PlayerData.getAttribute('damage').value * 5;
        this.spawnBullet({ damage: damage, isPiercing: true });
    },

    handleTripleShot() {
        const damage = PlayerData.getAttribute('damage').value;
        const shotCount = 3;
        const interval = 0.1;

        for (let i = 0; i < shotCount; i++) {
            this.scheduleOnce(() => {
                this.spawnBullet({ damage: damage, isPiercing: false });
            }, i * interval);
        }
    },

    spawnBullet(options) {
        let bulletNode = null;
        if (this.bulletPool.size() > 0) {
            bulletNode = this.bulletPool.get(this, options);
        } else {
            bulletNode = cc.instantiate(this.bulletPrefab);
            const bulletItem = bulletNode.getComponent('BulletItem');
            bulletItem.reuse(this, options);
        }

        bulletNode.parent = this.node;
        bulletNode.position = this.playerNode.position;
    },

    recycleBullet(bulletNode) {
        this.bulletPool.put(bulletNode);
    },
});