"use strict";
cc._RF.push(module, '93efdRrUw9OGL7ZImC7VWs6', 'LoadingController');
// Scripts/Loading/LoadingController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        loadProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
        spineBoy: {
            default: null,
            type: sp.Skeleton
        }

    },

    onLoad: function onLoad() {
        this.initProgressBar();
        this.preLoadScene();
    },
    preLoadScene: function preLoadScene() {
        var _this = this;

        this.spineBoy.setAnimation(0, "run", true);
        cc.director.preloadScene("LobbyScene", function (completedCount, totalCount, item) {
            var percent = completedCount / totalCount;
            _this.loadProgressBar.progress = percent;
            var startX = _this.loadProgressBar.node.x - _this.loadProgressBar.node.width / 2;
            var moveDistance = _this.loadProgressBar.node.width * _this.loadProgressBar.progress;
            _this.spineBoy.node.x = moveDistance + startX;
        }, function () {
            cc.director.loadScene("LobbyScene");
        });
    },
    initProgressBar: function initProgressBar() {
        this.loadProgressBar.progress = 0;
    }
});

cc._RF.pop();