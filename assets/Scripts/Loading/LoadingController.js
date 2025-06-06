const Emitter = require("Emitter");
const EventType = require("EventsType");
cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: cc.ProgressBar,
        spineBoy: sp.Skeleton,
    },

    onLoad() {
        this.init();
    },

    init() {
        this.preLoadScene();
        Emitter.instance.emit(EventType.START_GAME);
    },

    preLoadScene() {
        this.progressBar.progress = 0;
        this.spineBoy.setAnimation(0, "run", true);
        cc.director.preloadScene("Lobby", (completedCount, totalCount, item) => {
            let percent = completedCount / totalCount;
            this.progressBar.progress = percent;
            const startX = this.progressBar.node.x - this.progressBar.node.width / 2;
            let moveDistance = this.progressBar.node.width * this.progressBar.progress;
            this.spineBoy.node.x = moveDistance + startX;
        },
            () => {
                cc.director.loadScene("Lobby");
            });
    },

    onDestroy() {
        this.node.StopAllActions();
    },

});
