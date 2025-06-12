const EventEmitter = require('events');
class mEmitter {
    constructor() {
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
    }
    emit(...args) {
        console.log(`Event emitted: ${args[0]}`, args.slice(1));

        this._emiter.emit(...args);
    }
    registerEvent(event, listener) {
        this._emiter.on(event, listener);
    }
    registerOnce(event, listener) {
        this._emiter.once(event, listener);
    }
    removeEvent(event, listener) {
        this._emiter.removeListener(event, listener);
    }
    registerEventsMap(eventsMap) {
        for (const event in eventsMap) {
            console.log(`Registering event: ${event}`);

            this.registerEvent(event, eventsMap[event]);
        }
    }
    removeEventsMap(eventsMap) {
        for (const event in eventsMap) {
            this.removeEvent(event, eventsMap[event]);
        }
    }
    destroy() {
        this._emiter.removeAllListeners();
        this._emiter = null;
        mEmitter.instance = null;
    }
}

mEmitter.instance = null;

if (!mEmitter.instance) {
    mEmitter.instance = new mEmitter();

}
module.exports = mEmitter;