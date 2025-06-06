const Emitter = require('../EventEmitter/Emitter');
import { Popup } from '../EventEmitter/EventKeys';

cc.Class({
    extends: cc.Component,

    properties: {
        settingsPopupPrefab: {
            default: null,
            type: cc.Prefab,
        },

        rankPopupPrefab: {
            default: null,
            type: cc.Prefab,
        }
    },

    onLoad() {
        this.init();
    },

    onDestroy() {
        Emitter.instance.removeEventsMap(this.eventsMap);
        Emitter.instance.removeEvent('popup_self_closed', this.onPopupSelfClosed.bind(this));
        this.forceHideCurrentPopup();
    },

    init() {
        cc.game.addPersistRootNode(this.node);
        
        this.currentPopup = null;
        this.initEventsMap();
        this.registerEventsMap();
        this.registerCleanupEvents();
    },
    initEventsMap() {
        this.eventsMap = {
            [Popup.SHOW_SETTING_POPUP]: this.showSetting.bind(this),
            [Popup.SHOW_RANK_POPUP]: this.showRank.bind(this),
            [Popup.HIDE_SETTING_POPUP]: this.hideSetting.bind(this),
            [Popup.HIDE_RANK_POPUP]: this.hideRank.bind(this)
        };
    },

    registerEventsMap() {
        Emitter.instance.registerEventsMap(this.eventsMap);
    },

    registerCleanupEvents() {
        Emitter.instance.registerEvent('popup_self_closed', this.onPopupSelfClosed.bind(this));
    },

    hideCurrentAndShow(prefab, popupName, data = null) {
        if (!prefab) {
            return;
        }
        
        if (this.currentPopup && this.currentPopup.isValid) {
            this.hideCurrentPopup(() => {
                this.showPopup(prefab, popupName, data);
            });
        } else {
            this.showPopup(prefab, popupName, data);
        }
    },

    hideCurrentPopup(callback = null) {
        if (!this.currentPopup || !this.currentPopup.isValid) {
            if (callback) callback();
            return;
        }

        cc.tween(this.currentPopup)
            .to(0.2, { scale: 0, opacity: 0 }, { easing: 'backIn' })
            .call(() => {
                this.currentPopup.removeFromParent();
                this.currentPopup.destroy();
                this.currentPopup = null;
                
                if (callback) callback();
            })
            .start();
    },

    showPopup(prefab, popupName, data = null) {
        const currentCanvas = cc.find('Canvas');
        if (!currentCanvas) {
            return null;
        }

        const popupInstance = cc.instantiate(prefab);
        currentCanvas.addChild(popupInstance);
        popupInstance.zIndex = 1000;
        
        this.currentPopup = popupInstance;
        this.setupPopupBeforeShow(popupInstance, popupName, data);
        this.animateShowPopup(popupInstance);

        return popupInstance;
    },

    setupPopupBeforeShow(popupNode, popupName, data) {
        const popupScript = popupNode.getComponent('PopupItem');
        if (!popupScript) {
            return;
        }

        if (popupScript.setPopupName) {
            popupScript.setPopupName(popupName);
        }

        if (data && popupScript.setData) {
            popupScript.setData(data);
        }

        if (popupScript.onShow) {
            popupScript.onShow();
        }
    },

    onPopupSelfClosed(popupName) {
        this.currentPopup = null;
    },

    animateShowPopup(popupNode) {
        popupNode.scale = 0;
        popupNode.opacity = 255;
        
        cc.tween(popupNode)
            .to(0.3, { scale: 1 }, { easing: 'backOut' })
            .start();
    },

    hasActivePopup() {
        return this.currentPopup && this.currentPopup.isValid;
    },

    getCurrentPopupName() {
        if (this.hasActivePopup()) {
            const popupScript = this.currentPopup.getComponent('PopupItem');
            return popupScript ? popupScript.getPopupName() : 'Unknown';
        }
        return null;
    },

    forceHideCurrentPopup() {
        if (this.currentPopup && this.currentPopup.isValid) {
            this.currentPopup.removeFromParent();
            this.currentPopup.destroy();
        }
        
        this.currentPopup = null;
    },

});