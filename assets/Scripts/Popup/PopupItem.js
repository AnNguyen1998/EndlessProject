const mEmitter = require('../EventEmitter/Emitter');

cc.Class({
    extends: cc.Component,

    properties: {
        closeButton: {
            default: null,
            type: cc.Button,        },

        hideAnimationDuration: {
            default: 0.2,        }
    },

    onLoad() {
        if (!this.closeButton) {
            this.closeButton = this.getComponentInChildren(cc.Button);
        }

        if (this.closeButton) {
            this.closeButton.node.on('click', this.hidePopup, this);
        }
    },

    onDestroy() {
        if (this.closeButton) {
            this.closeButton.node.off('click', this.hidePopup, this);
        }
    },

    setPopupName(name) {
        this.popupName = name;
    },

    getPopupName() {
        return this.popupName;
    },

    setData(data) {
        
    },

    hidePopup() {
        this.onHide();
        
        cc.tween(this.node)
            .to(this.hideAnimationDuration, { 
                scale: 0, 
                opacity: 0 
            }, { easing: 'backIn' })
            .call(() => {
                mEmitter.instance.emit('popup_self_closed', this.popupName);
                
                this.node.removeFromParent();
                this.node.destroy();
            })
            .start();
    },

    onShow() {
        
    },

    onHide() {
        
    },

});