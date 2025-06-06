(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Portal/PortalController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'faa405GhDBJU4w9o8OuiNqY', 'PortalController', __filename);
// Scripts/PortalController.js

"use strict";

cc.Class({
    extends: cc.Component,

    onClick: function onClick() {
        cc.director.loadScene("LoadingScene");
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PortalController.js.map
        