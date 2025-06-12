const LocalStorageUnit = require('../Unit/LocalStorageUnit');
const LocalStorageKeys = require('../Unit/LocalStorageKeys');

const DEFAULT_PLAYER_DATA = {
    metaData: {
        playerName: "Player",
        playerLevel: 100,
        playerExperience: 0,
        playerGold: 10000,
        highestChapter: 100,
    },
    attributes: {
        hpLevel: { value: 1, level: 1 },
        damage: { value: 10, level: 1 },
        critChance: { value: 5, level: 1 },
        critRate: { value: 1.5, level: 1 },
        attackSpeed: { value: 1.0, level: 1 },
    },
    chapterHistory: [
        {
            chapter: 1,
            star: 0
        }
    ]
};

class PlayerTemplate {
    constructor() {
        this._data = null;
    }

    load() {
        const savedData = LocalStorageUnit.get(LocalStorageKeys.PLAYER_DATA);
        if (savedData) {
            this._data = savedData;
            this._data.chapterHistory = savedData.chapterHistory || [
                { chapter: 1, star: 0 }
            ];
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

    getHighestChapter() {
        return this._data.metaData.highestChapter;
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

    setHighestChapter(chapter) {
        this._data.metaData.highestChapter = chapter;
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

    getChapterStar(chapterNumber) {
        const record = this._data.chapterHistory.find(c => c.chapter === chapterNumber);
        return record ? record.star : 0;
    }

    setChapterStar(chapterNumber, stars) {
        let record = this._data.chapterHistory.find(c => c.chapter === chapterNumber);
        if (record) {
            record.star = Math.max(record.star, stars);
        } else {
            this._data.chapterHistory.push({ chapter: chapterNumber, star: stars });
        }
    }

    isChapterUnlocked(chapterNumber) {
        return this._data.chapterHistory.some(c => c.chapter === chapterNumber);
    }

    unlockNextChapter(chapterNumber) {
        if (!this._data || !this._data.chapterHistory) return;
        const current = this._data.chapterHistory.find(c => c.chapter === chapterNumber);
        if (current && current.star > 0) {
            const nextChapter = chapterNumber + 1;
            const exists = this._data.chapterHistory.some(c => c.chapter === nextChapter);
            if (!exists) {
                this._data.chapterHistory.push({ chapter: nextChapter, star: 0 });
            }
        }
    }


}

const instance = new PlayerTemplate();
module.exports = instance;
