const LocalStorageUnit = require('../Unit/LocalStorageUnit');
const LocalStorageKeys = require('../Unit/LocalStorageKeys');

const DEFAULT_PLAYER_DATA = {
    metaData: {
        playerName: "Player",
        playerLevel: 1,
        playerExperience: 0,
        playerGold: 0,
        playerDiamonds: 0,
        playerAvatar: "default_avatar",
    },
    attributes: {
        hp: { value: 100, level: 1 },
        damage: { value: 10, level: 1 },
        critChance: { value: 0.05, level: 1 },
        critRate: { value: 1.5, level: 1 },
        attackSpeed: { value: 1.0, level: 1 },
    }
};

class PlayerTemplate {
    constructor() {
        this._data = null;
    }

    load() {
        const savedData = LocalStorageUnit.get(LocalStorageKeys.PLAYER_DATA);
        if (savedData) {
            this._data = savedData;
            cc.log("Player data loaded from storage.");
        } else {
            this._data = JSON.parse(JSON.stringify(DEFAULT_PLAYER_DATA));
            cc.log("No saved data found. Created new player data.");
        }
    }

    save() {
        if (!this._data) {
            cc.error("Cannot save because no data is loaded. Call load() first.");
            return;
        }
        LocalStorageUnit.set(LocalStorageKeys.PLAYER_DATA, this._data);
        cc.log("Player data has been saved to storage.");
    }

    reset() {
        cc.log("Resetting player data to default.");
        this._data = JSON.parse(JSON.stringify(DEFAULT_PLAYER_DATA));
        this.save();
    }

    getAllData() {
        return this._data;
    }

    getGold() {
        return this._data.metaData.playerGold;
    }

    getLevel() {
        return this._data.metaData.playerLevel;
    }

    getExperience() {
        return this._data.metaData.playerExperience;
    }
    
    getPlayerName() {
        return this._data.metaData.playerName;
    }

    getAttribute(attributeName) {
        return this._data.attributes[attributeName] || null;
    }

    addGold(amount) {
        this._data.metaData.playerGold += amount;
        if (this._data.metaData.playerGold < 0) {
            this._data.metaData.playerGold = 0;
        }
    }

    addExperience(amount) {
        this._data.metaData.playerExperience += amount;
    }

    setLevel(level) {
        this._data.metaData.playerLevel = level;
    }
    
    setPlayerName(name) {
        this._data.metaData.playerName = name;
    }

    updateAttributeValue(attributeName, newValue) {
        if (this._data.attributes[attributeName]) {
            this._data.attributes[attributeName].value = newValue;
        } else {
            cc.warn(`Attribute "${attributeName}" does not exist.`);
        }
    }
    
    upgradeAttributeLevel(attributeName) {
        if (this._data.attributes[attributeName]) {
            this._data.attributes[attributeName].level++;
        } else {
            cc.warn(`Attribute "${attributeName}" does not exist.`);
        }
    }
}

const instance = new PlayerTemplate();
module.exports = instance;
