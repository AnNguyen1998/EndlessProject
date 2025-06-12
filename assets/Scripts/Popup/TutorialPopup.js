cc.Class({
    extends: require('PopupItem'),

    properties: {
        closeButton: cc.Button,
    },

    onLoad() {
        this._super();
        this.registerButtonEvents();
    },

    onDestroy() {
        this.unregisterButtonEvents();
        this._super();
    },

    registerButtonEvents() {
        if (this.closeButton) {
            this.closeButton.node.on('click', this.onCloseClick, this);
        }
    },

    unregisterButtonEvents() {
        if (this.closeButton && this.closeButton.node) {
            this.closeButton.node.off('click', this.onCloseClick, this);
        }
    },

    onCloseClick() {
        this.hide();
    },

});
