const InputController = require("../Input/InputController");
const MobState = require("../Mob/MobState");
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
        wareCountLabel: { default: null, type: cc.Label },
        coinLabel: { default: null, type: cc.Label },
        starLabel: { default: null, type: cc.Label },
        mobs: [],
        defender: { default: null, type: cc.Prefab },
        defenders: [],
        flySwordPrefab: { default: null, type: cc.Prefab },
        flySwords: [],
        lastLane: { default: 0, type: cc.Integer },
        laneCount: { default: 3, type: cc.Integer },
        spawnInterval: { default: 3.5, type: cc.Float },
        spawnTimer: { default: 0, type: cc.Float },
        gameScript: { default: null, type: Object },
        currentLevel: { default: 0, type: cc.Integer },
        currentWave: { default: 0, type: cc.Integer },
        mobSpawnQueue: [],
        mobsActive: [],
        waveInfoBadgeNode: { default: null, type: cc.Node },
        isWin: { default: false, type: cc.Boolean },
        isLose: { default: false, type: cc.Boolean },
        levelNameLabel: { default: null, type: cc.Label },
        gameSciptJsonAsset: cc.JsonAsset,
    },

    onLoad() {
        this.init();
    },

    init() {
        // console.log("this.gameSciptJsonAsset", this.gameSciptJsonAsset);
        this.gameScript = this.gameSciptJsonAsset.json;
        this.spawnInterval = 1.5;
        this.spawnTimer = 0;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        this.currentLevel = 0;
        this.currentWave = 0;
        this.mobSpawnQueue = [];
        this.mobsActive = [];
        this.waveInfoBadgeNode.active = false;
        this.prepareWave();
        this.generateFlySword();

    },

    showWaveStartAnimation() {
        if (!this.waveInfoBadgeNode) return;

        // const labelNode = this.waveInfoBadgeNode.getChildByName('Background').getChildByName('Label');
        const labelNode = this.waveInfoBadgeNode.getChildByName('Label');
        const label = labelNode.getComponent(cc.Label);
        label.string = `WAVE ${this.currentWave + 1}`;

        const animation = this.waveInfoBadgeNode.getComponent(cc.Animation);
        if (animation) {
            this.waveInfoBadgeNode.active = true;
            animation.play();
            this.waveInfoBadgeNode.children.forEach(child => {
                if (child.getComponent(cc.Animation)) {
                    child.active = true;
                    child.getComponent(cc.Animation).play();
                }
            });

        }

        //đợi 2s sau đó ẩn đi. dùng tween
        this.scheduleOnce(() => {
            this.waveInfoBadgeNode.active = false;
            label.string = '';
        }, 2);
    },

    update(dt) {
        if (this.isWin || this.isLose) return;
        if (!this.gameScript) return;
        if (this.currentLevel >= this.gameScript.levels.length) return;
        if (this.currentWave >= this.gameScript.levels[this.currentLevel].waveCount) return;

        this.spawnTimer -= dt;

        if (this.mobSpawnQueue.length === 0 && this.currentWave < this.gameScript.levels[this.currentLevel].waveCount - 1) {
            this.currentWave++;
            this.wareCountLabel.string = `${this.currentWave + 1}/${this.gameScript.levels[this.currentLevel].waveCount}`;
            this.prepareWave();
        } else {
            //check win: if all mobs are defeated
            if (this.mobSpawnQueue.length === 0 && this.currentWave === this.gameScript.levels[this.currentLevel].waveCount - 1) {
                console.log("this.getAliveMobCount()", this.getAliveMobCount());

                if (this.getAliveMobCount() === 0) {
                    console.log("Win!");
                    this.isWin = true;
                    // this.resetThisLevel();
                    this.goNextLevel();
                    return
                }


            }
        }

        if (this.mobSpawnQueue.length === 0) return;

        if (this.spawnTimer <= 0) {
            this.trySpawnMob();
            this.spawnTimer = this.spawnInterval;
        }
        this.updateLabels();
        this.updateLevelNameLabel();
        // this.updateWareLabelBagedNode(dt);
    },


    resetThisLevel() {
        this.currentWave = 0;
        this.mobSpawnQueue = [];
        this.mobsActive = [];
        this.waveInfoBadgeNode.active = false;
        this.prepareWave();
        this.generateFlySword();
        this.updateLabels();
    },

    goNextLevel() {
        console.log("Going to next level");

        this.currentLevel++;
        if (this.currentLevel >= this.gameScript.levels.length) {
            console.log("Game Over! You have completed all levels!");
            this.currentLevel = 0; // Reset to first level
            this.currentWave = 0;
            this.mobSpawnQueue = [];
            this.mobsActive = [];
            this.waveInfoBadgeNode.active = false;
            this.prepareWave();
            this.generateFlySword();
            this.updateLabels();
            return;
        }
        this.isLose = false;
        this.isWin = false;
        this.currentWave = 0;
        this.mobSpawnQueue = [];
        this.mobsActive = [];
        this.waveInfoBadgeNode.active = false;
        this.prepareWave();
        this.generateFlySword();
        this.updateLabels();
    },

    updateLabels() {
        if (!this.wareCountLabel || !this.coinLabel || !this.starLabel) return;
        this.wareCountLabel.string = `${this.currentWave + 1}/${this.gameScript.levels[this.currentLevel].waveCount}`;
        // this.coinLabel.string = `Coins: ${this.gameScript.levels[this.currentLevel].coin}`;
        // this.starLabel.string = `Stars: ${this.gameScript.levels[this.currentLevel].star}`;
    },
    updateLevelNameLabel() {
        if (!this.levelNameLabel) return;

        const targetName = this.gameScript.levels[this.currentLevel].levelName;
        if (this.levelNameLabel.string === targetName) return;

        this.levelNameLabel.string = targetName;

        const n = this.levelNameLabel.node;
        n.stopAllActions();

        cc.tween(n)
            .set({ scale: 0.5, opacity: 0 })
            .parallel(
                cc.tween().to(0.18, { scale: 1.4 }, { easing: 'quadOut' }),
                cc.tween().to(0.18, { opacity: 255 }, { easing: 'quadOut' })
            )
            .to(0.10, { scale: 1 }, { easing: 'backIn' })
            .start();
    },

    prepareWave() {
        console.log("this.gameScript.levels", this.gameScript);

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
        this.showWaveStartAnimation();
    },

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

    getAliveMobCount() {
        var activeMobs = 0;
        for (let index = 0; index < this.mobsActive.length; index++) {
            const element = this.mobsActive[index];
            const mobItem = element.getComponent('MobItem');
            if (mobItem && mobItem.stateMachine.can(MobTransition.DIE)) {
                activeMobs++;
            }

        }
        return activeMobs;
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
    generateFlySword() {
        this.flySwords.forEach(s => s.destroy && s.destroy());
        this.flySwords = [];

        for (let i = 0; i < this.laneCount; i++) {
            let flySword = cc.instantiate(this.flySwordPrefab);
            flySword.parent = this.node;
            flySword.setPosition(cc.v2(GAME_AREA.bottomLeft.x + 20, this.getLanePosition(i) + 50));
            let flySwordItem = flySword.getComponent('FlySwordItem');
            if (flySwordItem) {
                flySwordItem.node.group = "FlySwordGroup";
            }
            flySwordItem.name = `FlySword ${i}`;
            console.log(`FlySword ${i} position: ${flySword.position}`);

            // flySwordItem.node.scaleY = 0;
            flySword.active = true;
            this.flySwords.push(flySword);
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
