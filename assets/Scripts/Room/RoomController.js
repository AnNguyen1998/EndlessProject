const MobTransition = require("../Mob/MobTransition");

const GAME_AREA = {
    topLeft: cc.v2(0, 450),
    topRight: cc.v2(1560, 450),
    bottomLeft: cc.v2(0, 0),
    bottomRight: cc.v2(1560, 0)
};
cc.Class({
    extends: cc.Component,
    properties: {
        mob: { default: null, type: cc.Prefab },
        mobs: [],
        defender: { default: null, type: cc.Prefab },
        defenders: [],
        mobCount: { default: 50, type: cc.Integer },
        lastLane: { default: 0, type: cc.Integer },
        laneCount: { default: 3, type: cc.Integer },
        spawnInterval: { default: 3.5, type: cc.Float },
        spawnTimer: { default: 0, type: cc.Float },
    },

    onLoad() {
        this.generateMobs(this.mobCount);
        this.spawnTimer = 0;
        cc.director.getCollisionManager().enabled = true;
        this.generateDefenders();
        // cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    update(dt) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.trySpawnMob();
            this.spawnTimer = this.spawnInterval;

        }
        let activeMobs = this.mobs.filter(mob => mob.active);

        this.defenders.forEach(defender => {
            let defenderItem = defender.getComponent('DefenderItem');
            if (defenderItem && defenderItem.stateMachine.can('activate')) {
                defenderItem.activate();
            }
        });

    },
    trySpawnMob() {
        let activeMobs = this.mobs.filter(mob => mob.active);

        if (activeMobs.length >= 6) {
            var int = Math.floor(Math.random() * 100);
            console.log(`Active mobs: ${activeMobs.length}, Random int: ${int}`);

            if (int < 30) {
                return;
            }
        }


        let laneIndex = this.getLane(this.lastLane);
        let mob = this.mobs.find(mob => !mob.active && mob.getComponent('MobItem') && mob.getComponent('MobItem').stateMachine.can('spawn'));
        if (!mob) {
            //TODO: Check điều kiện thắng
            console.warn("No available mob to spawn");
            return;
        }
        let mobItem = mob.getComponent('MobItem');
        if (!mobItem) {
            console.warn("MobItem not found on mob");
            return;
        }

        mob.setPosition(GAME_AREA.topRight.x, this.getLanePosition(laneIndex));
        // mobItem.spawn();
        if (mobItem.stateMachine.can(MobTransition.SPAWN)) {
            mobItem.spawn();
            console.log(`Mob spawned at lane ${laneIndex} with position: ${mob.getPosition()}`);
            
        }
    },
    getLane(lastLane) {
        let laneIndex = Math.floor(Math.random() * this.laneCount);
        while (laneIndex === lastLane) {
            laneIndex = Math.floor(Math.random() * this.laneCount);
        }
        this.lastLane = laneIndex;
        return laneIndex;
    },
    getLanePosition(laneIndex) {
        const startY = GAME_AREA.bottomLeft.y + 100;
        const endY = GAME_AREA.bottomLeft.y + 500;
        const step = (endY - startY) / (this.laneCount - 1);
        return startY + laneIndex * step;
    },

    generateMobs(count) {
        this.mobs = [];
        for (let i = 0; i < count; i++) {
            let mob = cc.instantiate(this.mob);
            mob.parent = this.node;
            mob.active = false;
            this.mobs.push(mob);
        }
    },
    generateDefenders() {
        this.defenders.forEach(d => d.destroy && d.destroy());
        this.defenders = [];
        let xList = [
            GAME_AREA.bottomLeft.x + 100,
            GAME_AREA.bottomLeft.x + 300,
            GAME_AREA.bottomLeft.x + 100
        ];
        for (let i = 0; i < this.laneCount; i++) {
            let defender = cc.instantiate(this.defender);
            defender.parent = this.node;
            defender.setPosition(cc.v2(xList[i], this.getLanePosition(i)));
            let defenderItem = defender.getComponent('DefenderItem');
            if (defenderItem) {
                defenderItem.node.group = "DefenderGroup";
            }
            defenderItem.name = `Defender ${i}`;
            defenderItem.node.scaleY = 0;
            defender.active = true;

            this.defenders.push(defender);
        }
    },


});
