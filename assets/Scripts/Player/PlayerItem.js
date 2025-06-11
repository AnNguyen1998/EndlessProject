cc.Class({
    extends: cc.Component,
    properties: {
        hpLevel: 1,
        damage: 50,
        attackSpeed: 1.0,
        critChance: 0.05,
        critRate: 1.5,

        hpLevelMax: 5,
        damageMax: 10,
        attackSpeedMax: 5,
        critChanceMax: 5,
        critRateMax: 8,

        
        gold: 0,
        playerLevel: 1,
        chapter: 1
    },

    getAttribute(attr) {
        return this[attr];
    },

    setAttribute(attr, value) {
        this[attr] = value;
    },

    canUpgrade(attr, config) {
        const attrLevel = this[attr];
        const maxLevel = this[attr + 'Max'];
        if (attrLevel >= maxLevel) return false;
        const factoryArr = config['attributes_factory'].find(e => e.name === attr).factory;
        const nextCfg = factoryArr.find(e => e.level === attrLevel + 1);
        if (!nextCfg) return false;
        if (this.gold < nextCfg.price) return false;
        if (this.playerLevel < nextCfg.condition.required_player_level) return false;
        if (this.chapter < nextCfg.condition.chapter) return false;
        return true;
    },

    upgrade(attr, config) {
        const attrLevel = this[attr];
        const factoryArr = config['attributes_factory'].find(e => e.name === attr).factory;
        const nextCfg = factoryArr.find(e => e.level === attrLevel + 1);
        if (!nextCfg) return false;
        if (this.gold < nextCfg.price) return false;
        if (this.playerLevel < nextCfg.condition.required_player_level) return false;
        if (this.chapter < nextCfg.condition.chapter) return false;
        this.gold -= nextCfg.price;
        this[attr] = attrLevel + 1;
        if (attr === 'hpLevel') {
            // HP bonus cộng thẳng
            this.hpLevel += nextCfg.bonus;
        } else {
            // Các chỉ số khác nhân hệ số
            this[attr] = this[attr] * nextCfg.multiplier;
        }
        return true;
    },

    getStat(attr, config) {
        if (attr === 'hpLevel') return this.hpLevel;
        const base = this['_' + attr + 'Base'] || this[attr];
        const level = this[attr];
        const factoryArr = config['attributes_factory'].find(e => e.name === attr).factory;
        let result = base;
        for (let i = 1; i <= level; i++) {
            const cfg = factoryArr.find(e => e.level === i);
            if (!cfg) continue;
            if (cfg.multiplier) result *= cfg.multiplier;
            if (cfg.bonus) result += cfg.bonus;
        }
        return result;
    }
});
