const LocalStorageUnit = {
    get(key, defaultValue = null) {
        let value = cc.sys.localStorage.getItem(key);
        if (value === null || value === undefined) {
            return defaultValue;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },

    set(key, value) {
        if (value === null || value === undefined) {
            this.remove(key);
            return;
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        cc.sys.localStorage.setItem(key, value);
    },

    remove(key) {
        cc.sys.localStorage.removeItem(key);
    },

    clear() {
        cc.sys.localStorage.clear();
    }
};

module.exports = LocalStorageUnit;
