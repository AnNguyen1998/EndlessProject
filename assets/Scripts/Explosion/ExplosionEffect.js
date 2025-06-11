cc.Class({
    extends: cc.Component,
    onAnimFinished() {
        this.node.destroy();
    }
});
