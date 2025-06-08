cc.Class({
    extends: cc.Component,
    init(parentNode) {
        if (parentNode) {
            parentNode.addChild(this.node);
        } else {
            let canvas = cc.director.getScene().getChildByName('Canvas');
            if (canvas) canvas.addChild(this.node);
        }
    },
    onDestroy() {
        // cleanup nếu cần
    }
});
module.exports = PopupItem; 