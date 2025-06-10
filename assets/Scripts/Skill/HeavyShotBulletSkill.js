const SkillItem = require('Skill/SkillItem');

cc.Class({
    extends: SkillItem,

    properties: {
        skillName: {
        default: 'Heavy Shot',
        type: cc.String,
        },
        cooldown: {
            default: 1,
            type: cc.Float,
        },
        duration: {
            default: 0.1,
            type: cc.Float,
        },
        skillName: {
            default: 'Heavy Shot',
            type: cc.String,
        },
        cooldown: {
            default: 1,
            type: cc.Float,
        },
        duration: {
            default: 0.1,
            type: cc.Float,
        },
        skillName: {
            default: 'Heavy Shot',
            type: cc.String,
        },
        cooldown: {
            default: 1,
            type: cc.Float,
        },
        duration: {
            default: 0.1,
            type: cc.Float,
        },
        skillName: {
            default: 'Heavy Shot',
            type: cc.String,
        },
        cooldown: {
            default: 1,
            type: cc.Float,
        },
        duration: {
            default: 0.1,
            type: cc.Float,
        },
        bulletPrefab: cc.Prefab, // Kéo prefab viên đạn đặc biệt vào đây
        firePoint: cc.Node,      // Vị trí xuất phát viên đạn (thường là node player)
    },
    
    onLoad() {
        this._super();
    },
    onActivate() {
        // Gọi hàm cha để phát events
        // SkillItem.prototype.onActivate.call(this);

        // Logic bắn đạn đặc biệt
        if (this.bulletPrefab && this.firePoint) {
            const bullet = cc.instantiate(this.bulletPrefab);
            bullet.parent = cc.director.getScene();
            bullet.setPosition(this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0)));
            
            const bulletComponent = bullet.getComponent('HeavyShotBullet');
            if (bulletComponent) {
                bulletComponent.isOneShot = true;
            }
        }
    },
});