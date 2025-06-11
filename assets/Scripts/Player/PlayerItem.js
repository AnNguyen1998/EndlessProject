cc.Class({
    extends: cc.Component,
    properties: {
        hpLevel: 1,
        damage: 50,
        attackSpeed: 1.0,
        critChance: 0.05,
        critRate: 1.5,
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
