cc.Class({
    extends: cc.Component,
    properties: {

    },
    onLoad() {
        this.node.active = false; 
        this.node.opacity = 255; 
    },
    onDestroy() {
    },
    show() {    
        this.node.active = true;
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.2));
    },
    hide() {
        this.node.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.node.active = false;
            })
        ));
    },
})