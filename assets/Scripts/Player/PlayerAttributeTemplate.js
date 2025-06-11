const PlayerAttributeTemplate = {
    hpLevel: { value: 0, level: 1 },
    damage: { value: 0, level: 1 },
    critChance: { value: 0, level: 1 },
    critRate: { value: 0, level: 1 },
    attackSpeed: { value: 0, level: 1 },
    getAttribute(attributeName) {
        return this[attributeName] ? this[attributeName].value : null;
    },
    setAttribute(attributeName, value) {
        if (this[attributeName]) {
            this[attributeName].value = value;
        }
    },
    getLevel(attributeName) {
        return this[attributeName] ? this[attributeName].level : null;
    },
    setLevel(attributeName, level) {
        if (this[attributeName]) {
            this[attributeName].level = level;
        }
    },
};

module.exports = PlayerAttributeTemplate;