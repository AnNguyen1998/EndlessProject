const LocalStorageUnit = {
    get(key, defaultValue = null) {
        let value = cc.sys.localStorage.getItem(key);
        if (value === null) value = defaultValue;
        return value;
    },
    set(key, value) {
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