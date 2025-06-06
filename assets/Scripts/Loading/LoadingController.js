const Emitter = require("Emitter");
import { Game } from 'EventKeys'
cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: cc.ProgressBar,
        spineBoy: sp.Skeleton,
        blackBackground: cc.Node,
    },

    onLoad() {
        this.init();
    },

    init() {
        this.preLoadScene();
        Emitter.instance.emit(Game.START_GAME);
        this.blackBackground.opacity = 0;
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
                cc.tween(this.blackBackground)
                    .by(0.5, { opacity: 255 })
                    .call(() => {
                        cc.director.loadScene("Lobby");
                    })
                    .start();
            });
    },

    onDestroy() {
        this.node.stopAllActions();
    },

});
