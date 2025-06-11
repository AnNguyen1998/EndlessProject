const SkillItem = require('Skill/SkillItem');

cc.Class({
    extends: SkillItem,

    properties: {
        skillName: {
            default: 'Heavy Shot',
            override: true,
        },
        cooldown: {
            default: 1,
            override: true,
        },
        duration: {
            default: 0.1,
            override: true,
        },
        bulletPrefab: cc.Prefab, 
        firePoint: cc.Node,     
    },
    
    onLoad() {
        this._super();
    },
    onActivate() {
        this._super();
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