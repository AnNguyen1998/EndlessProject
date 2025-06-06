cc.Class({
    extends: cc.Component,

    properties: {

        loadProgressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        spineBoy: {
            default: null,
            type: sp.Skeleton,
        },

    },

    onLoad() {
        this.initProgressBar();
        this.preLoadScene();
    },

    preLoadScene() {
        this.spineBoy.setAnimation(0, "run", true);
        cc.director.preloadScene("LobbyScene", (completedCount, totalCount, item) => {
            let percent = completedCount / totalCount;
            this.loadProgressBar.progress = percent;
            const startX = this.loadProgressBar.node.x - this.loadProgressBar.node.width / 2;
            let moveDistance = this.loadProgressBar.node.width * this.loadProgressBar.progress;
            this.spineBoy.node.x = moveDistance + startX;
        },
            () => {
                     cc.director.loadScene("LobbyScene");
            });
    },

    initProgressBar() {
        this.loadProgressBar.progress = 0;
    },

});
