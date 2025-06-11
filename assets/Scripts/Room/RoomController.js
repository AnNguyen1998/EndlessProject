const InputController = require("../Input/InputController");
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
        mobPrefabs: { default: [], type: [cc.Prefab] },
        mobPrefabNames: { default: [], type: [cc.String] },
        wareLabel: { default: null, type: cc.Label },
        coinLabel: { default: null, type: cc.Label },
        starLabel: { default: null, type: cc.Label },
        mobs: [],
        defender: { default: null, type: cc.Prefab },
        defenders: [],
        lastLane: { default: 0, type: cc.Integer },
        laneCount: { default: 3, type: cc.Integer },
        spawnInterval: { default: 3.5, type: cc.Float },
        spawnTimer: { default: 0, type: cc.Float },
        gameScript: { default: null, type: Object },
        currentLevel: { default: 0, type: cc.Integer },
        currentWave: { default: 0, type: cc.Integer },
        mobSpawnQueue: [],
        mobsActive: [],
        inputController: { default: null, type: InputController }
    },

    onLoad() {
        this.init();
    },

    init() {
        this.spawnInterval = 3.5;
        this.spawnTimer = 0;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        this.fakeInitGameScript();
        this.currentLevel = 0;
        this.currentWave = 0;
        this.mobSpawnQueue = [];
        this.mobsActive = [];
        this.prepareWave();
        this.inputController = new InputController();
        this.inputController.node = this.node;
        this.inputController.init();
        // this.generateDefenders();
    },

    fakeInitGameScript() {
        const gameScript = {
            "levels": [
                {
                    "levelId": 1,
                    "duration": 300,
                    "waveCount": 3,
                    "enemyWaves": [
                        {
                            "types": [
                                { "name": "wolf", "health": 80, "damage": 8, "speed": 60, "number": 5 },
                                { "name": "twinfang", "health": 120, "damage": 12, "speed": 90, "number": 2 }
                            ]
                        },
                        {
                            "types": [
                                { "name": "wolf", "health": 110, "damage": 11, "speed": 90, "number": 10 },
                                { "name": "twinfang", "health": 155, "damage": 16, "speed": 110, "number": 4 }
                            ]
                        },
                        {
                            "types": [
                                { "name": "wolf", "health": 120, "damage": 12, "speed": 100, "number": 8 },
                                { "name": "twinfang", "health": 170, "damage": 18, "speed": 120, "number": 4 },
                                { "name": "drakey", "health": 300, "damage": 25, "speed": 80, "number": 1 }
                            ]
                        }
                    ]
                }
            ]
        };

        this.gameScript = gameScript;
    },

    update(dt) {
        if (!this.gameScript) return;
        if (this.currentLevel >= this.gameScript.levels.length) return;
        if (this.currentWave >= this.gameScript.levels[this.currentLevel].waveCount) return;

        this.spawnTimer -= dt;

        if (this.mobSpawnQueue.length === 0 && this.currentWave < this.gameScript.levels[this.currentLevel].waveCount - 1) {
            this.currentWave++;
            this.wareLabel.string = `${this.currentWave + 1}/${this.gameScript.levels[this.currentLevel].waveCount}`;
            this.prepareWave();
        }

        if (this.mobSpawnQueue.length === 0) return;

        if (this.spawnTimer <= 0) {
            this.trySpawnMob();
            this.spawnTimer = this.spawnInterval;
        }
        this.updateLabels();
    },

    updateLabels() {
        if (!this.wareLabel || !this.coinLabel || !this.starLabel) return;
        this.wareLabel.string = `${this.currentWave + 1}/${this.gameScript.levels[this.currentLevel].waveCount}`;
        // this.coinLabel.string = `Coins: ${this.gameScript.levels[this.currentLevel].coin}`;
        // this.starLabel.string = `Stars: ${this.gameScript.levels[this.currentLevel].star}`;
    },

    prepareWave() {
        const level = this.gameScript.levels[this.currentLevel];
        const wave = level.enemyWaves[this.currentWave];

        // gom quái vào queue
        this.mobSpawnQueue = [];
        wave.types.forEach(t => {
            for (let i = 0; i < t.number; i++) {
                this.mobSpawnQueue.push({ name: t.name, health: t.health, damage: t.damage, speed: t.speed });
            }
        });
        this.shuffleArray(this.mobSpawnQueue);
        this.spawnInterval = this.spawnInterval;
        this.spawnTimer = 0;
        this.generateMobs();
    }
    ,

    trySpawnMob() {
        if (this.mobSpawnQueue.length === 0) return;
        let activeMobs = this.mobsActive.filter(mob => mob.active);
        // if (activeMobs.length >= 6) {
        //     let int = Math.floor(Math.random() * 100);
        //     if (int < 30) return;
        // }
        let mobInfo = this.mobSpawnQueue.shift();
        let prefabIndex = this.mobPrefabNames.indexOf(mobInfo.name);
        if (prefabIndex === -1) return;
        let mob = this.getInactiveMob(prefabIndex);
        if (!mob) return;
        let laneIndex = this.getLane(this.lastLane);
        mob.setPosition(GAME_AREA.topRight.x + mob.width, this.getLanePosition(laneIndex));
        let mobItem = mob.getComponent('MobItem');
        mobItem.setStats(mobInfo.health, mobInfo.damage, mobInfo.speed);
        if (mobItem && mobItem.stateMachine.can(MobTransition.SPAWN)) {
            mobItem.spawn();
        }
        mob.active = true;
        this.mobsActive.push(mob);
    },

    getInactiveMob(prefabIndex) {
        for (let i = 0; i < this.mobs.length; i++) {
            let mob = this.mobs[i];
            if (!mob.active && mob.mobTypeIndex === prefabIndex) {
                return mob;
            }
        }
        for (let i = 0; i < this.mobs.length; i++) {
            let mob = this.mobs[i];
            if (!mob.active) {
                mob.mobTypeIndex = prefabIndex;
                mob.getComponent('MobItem').setType(this.mobPrefabNames[prefabIndex]);
                return mob;
            }
        }
        let mob = cc.instantiate(this.mobPrefabs[prefabIndex]);
        mob.parent = this.node;
        mob.active = false;
        mob.mobTypeIndex = prefabIndex;
        mob.getComponent('MobItem').setType(this.mobPrefabNames[prefabIndex]);
        this.mobs.push(mob);
        return mob;
    },

    getLane(lastLane) {
        let laneIndex = Math.floor(Math.random() * this.laneCount);
        while (laneIndex === lastLane && this.laneCount > 1) {
            laneIndex = Math.floor(Math.random() * this.laneCount);
        }
        this.lastLane = laneIndex;
        return laneIndex;
    },

    getLanePosition(laneIndex) {
        const startY = GAME_AREA.bottomLeft.y + 70;
        const endY = GAME_AREA.bottomLeft.y + 450;
        const step = (endY - startY) / (this.laneCount - 1);
        return startY + laneIndex * step;
    },

    generateMobs() {
        this.mobs = [];
        let wave = this.gameScript.levels[this.currentLevel].enemyWaves[this.currentWave];
        for (let i = 0; i < wave.types.length; i++) {
            let mobType = wave.types[i];
            let prefabIndex = this.mobPrefabNames.indexOf(mobType.name);
            if (prefabIndex === -1) continue;
            for (let j = 0; j < mobType.number; j++) {
                let mob = cc.instantiate(this.mobPrefabs[prefabIndex]);
                mob.parent = this.node;
                mob.active = false;
                mob.mobTypeIndex = prefabIndex;
                mob.getComponent('MobItem').setType(this.mobPrefabNames[prefabIndex]);
                this.mobs.push(mob);
            }
        }
        this.mobsActive = [];
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

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    onDestroy() {
        if (this.inputController) {
            this.inputController.unregisterInputEvents();
        }
        this.mobs.forEach(mob => {
            if (mob.destroy) mob.destroy();
        });
        this.mobs = [];
        this.mobsActive = [];
        this.defenders.forEach(defender => {
            if (defender.destroy) defender.destroy();
        });
        this.defenders = [];
    }
});
