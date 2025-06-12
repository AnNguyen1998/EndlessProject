const MobStateMachine = require('./MobStateMachine');
const MobState = require('./MobState');
const MobTransition = require('./MobTransition');
const DefenderState = require('../Defender/DefenderState');
const { Player } = require('../EventEmitter/EventKeys');
const PlayerData = require('../Player/PlayerTemplate');
cc.Class({
  extends: cc.Component,
  properties: {
    speed: 100,
    health: 100,
    maxHealth: 100,
    damage: 5,
    healthBar: {
      default: null,
      type: cc.ProgressBar,
    },
    mobType: '',
  },

  statics: {
    numDie: 0,
  },

  onLoad() {
    this.maxHealth = this.health;
    this.stateMachine = MobStateMachine.createStateMachine(this);
    this.effectTimers = {};
   
  },

  onCollisionEnter(other, self) {
    if (other.node.group === 'BulletGroup') {
      const bulletItem = other.getComponent('BulletItem');
      if (bulletItem) {
        this.takeDamage(bulletItem.damage);
      }
    }
    if (other.node.group === 'DefenderGroup') {
      this.attackDefender(other.node);
    }
    if (other.node.group === 'PlayerGroup') {
      this.attackDefender(other.node);
    }
    if (other.node.group === 'FlySwordGroup') {
      if (this.stateMachine.can(MobTransition.DIE)) {
        this.stateMachine.die();
      }
    }
  },

  update(dt) {
    if (this.node && this.node.active) {
      if (this.stateMachine.state === MobState.MOVING) {
        this.onMove(dt);
      }
      this.updateEffects(dt);
      if (this.node.x < -200 && this.stateMachine.can(MobTransition.OUT_OF_SCREEN)) {
        this.stateMachine.outOfScreen();
      }
    }
    if (this.healthBar) {
      this.healthBar.progress = this.health / this.maxHealth;
    }
    return cc.v2(this.node.x, this.node.y);
  },

  attackDefender(defenderNode) {
    let defenderItem = defenderNode.getComponent('DefenderItem');
    if (defenderItem && this.stateMachine.can(MobTransition.ATTACK)) {
      if (defenderItem.isRespawning || defenderItem.stateMachine.state === DefenderState.DESTROYED) {
        return;
      }
      this.playAttackEffect();
      this.stateMachine.attack();
      defenderItem.takeDamageFromMob(this.getDamageValue());
      this.scheduleOnce(() => {
        if (this.stateMachine.can(MobTransition.MOVE)) {
          this.stateMachine.move();
        }
      }, 0.5);
    }
  },

  getDamageValue() {
    return this.damage || 15;
  },

  updateEffects(dt) {
    if (this.stateMachine.state === MobState.BURNING) {
      this.effectTimers.burning = (this.effectTimers.burning || 3) - dt;
      if (this.effectTimers.burning <= 0) {
        this.health -= 10;
        if (this.health <= 0 && this.stateMachine.can(MobTransition.DIE)) {
          this.stateMachine.die();
        } else if (this.stateMachine.can(MobTransition.RECOVER)) {
          this.stateMachine.recover();
        }
      }
    }
    if (this.stateMachine.state === MobState.POISONED) {
      this.effectTimers.poisoned = (this.effectTimers.poisoned || 5) - dt;
      if (this.effectTimers.poisoned <= 0) {
        this.health -= 5;
        if (this.health <= 0 && this.stateMachine.can(MobTransition.DIE)) {
          this.stateMachine.die();
        } else if (this.stateMachine.can(MobTransition.HEAL)) {
          this.stateMachine.heal();
        }
      }
    }
    if (this.stateMachine.state === MobState.STUNNED) {
      this.effectTimers.stunned = (this.effectTimers.stunned || 2) - dt;
      if (this.effectTimers.stunned <= 0 && this.stateMachine.can(MobTransition.RECOVER)) {
        this.stateMachine.recover();
      }
    }
    if (this.stateMachine.state === MobState.FROZEN) {
      this.effectTimers.frozen = (this.effectTimers.frozen || 3) - dt;
      if (this.effectTimers.frozen <= 0 && this.stateMachine.can(MobTransition.RECOVER)) {
        this.stateMachine.recover();
      }
    }
  },

  onSpawn() {
    this.node.active = true;
  },

  onMove(dt) {
    this.node.x -= this.speed * dt;
  },

  onAttack() { },

  onTakeDamage() {
    let sprite = this.node.getComponent(cc.Sprite);
    if (sprite) {
      let originalColor = sprite.node.color.clone();
      sprite.node.color = cc.Color.RED;
      cc.tween(sprite.node).to(0.05, { color: originalColor }).start();
    }
    cc.tween(this.node)
      .by(0.06, { x: 10 }, { easing: 'sineOut' })
      .by(0.06, { x: -20 }, { easing: 'sineInOut' })
      .by(0.06, { x: 10 }, { easing: 'sineIn' })
      .start();
  },

  onHeal() {
    this.health = Math.min(this.health + 20, this.maxHealth);
    if (this.stateMachine.can(MobState.HEALING)) {
      this.scheduleOnce(() => {
        this.stateMachine.recover();
      }, 1);
    }
  },

  onRecover() {
    this.effectTimers = {};
  },

  onDie() {
    // Stop any active tweens/actions to avoid overlap
    this.node.stopAllActions();
    const origColor = this.node.color.clone();
    const backward = -50;

    cc.tween(this.node)
      .parallel(
        //thu nhỏ lại
        cc.tween().to(0.3, { scale: 0.1 }, { easing: 'quadOut' }),
        cc.tween()
          .to(0.1, { color: cc.color(255, 60, 60) })
          .to(0.2, { color: cc.color(120, 120, 120) }),
        cc.tween()
          .by(0.1, { y: 28 }, { easing: 'quadOut' })
          .by(0.2, { y: -40, x: backward }, { easing: 'quadIn' }),
        cc.tween().to(0.2, { opacity: 0 }, { easing: 'quadIn' })
      )
      .call(() => {
        this.node.opacity = 255;
        this.node.color = origColor;
        // this.node.x -= backward;
        if (this.stateMachine.can(MobTransition.DEAD)) {
          this.stateMachine.dead();
        }
      })
      .start();
  },

  onDead() {
    this.node.active = false;
    this.constructor.numDie++;
  },

  onOutOfScreen() {
    this.node.active = false;
  },

  onReset() {
    this.health = this.maxHealth;
    this.effectTimers = {};
    this.node.active = false;
  },

  spawn() {
    if (this.stateMachine.can(MobTransition.SPAWN)) {
      this.stateMachine.spawn();
    }
  },

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      if (this.stateMachine.can(MobTransition.DIE)) {
        this.stateMachine.die();
      }
    } else if (this.stateMachine.can(MobTransition.TAKE_DAMAGE)) {
      this.stateMachine.takeDamage();
      this.scheduleOnce(() => {
        if (this.stateMachine.can(MobTransition.RECOVER)) {
          this.stateMachine.recover();
        }
      }, 0.5);
    }
  },

  reset() {
    if (this.stateMachine.can(MobTransition.RESET)) {
      this.stateMachine.reset();
    }
  },

  pushBack() {
    if (this.stateMachine.state !== MobState.MOVING) {
      return;
    }
    let pushDistance = 20;
    let originalX = this.node.x;
    cc.tween(this.node)
      .to(0.2, { x: originalX + pushDistance }, { easing: 'quadOut' })
      .call(() => {
        if (this.stateMachine.can(MobTransition.RECOVER)) {
          this.stateMachine.recover();
        }
      })
      .start();
  },

  playAttackEffect() {
    let sprite = this.node.getComponent(cc.Sprite);
    if (sprite) {
      let originalColor = sprite.node.color.clone();
      sprite.node.color = cc.Color.RED;
      cc.tween(sprite.node)
        .to(0.1, { color: cc.Color.WHITE })
        .to(0.1, { color: cc.Color.RED })
        .to(0.1, { color: originalColor })
        .start();
    }
    let originalScale = this.node.scale;
    cc.tween(this.node)
      .to(0.1, { scale: originalScale * 1.3 }, { easing: 'backOut' })
      .to(0.2, { scale: originalScale }, { easing: 'backIn' })
      .start();
    let originalPos = this.node.position.clone();
    cc.tween(this.node)
      .by(0.05, { x: 5 }, { easing: 'sineOut' })
      .by(0.05, { x: -10 }, { easing: 'sineInOut' })
      .by(0.05, { x: 5 }, { easing: 'sineIn' })
      .to(0.05, { position: originalPos })
      .start();
  },

  createStunEffect() {
    for (let i = 0; i < 3; i++) {
      let star = new cc.Node('Star');
      let starLabel = star.addComponent(cc.Label);
      starLabel.string = '★';
      starLabel.fontSize = 20;
      starLabel.node.color = cc.Color.YELLOW;
      star.parent = this.node.parent;
      let mobPos = this.node.position.clone();
      star.setPosition(mobPos.x, mobPos.y + this.node.height * 0.5);
      let radius = 30;
      let angle = (i * 120) * Math.PI / 180;
      cc.tween(star)
        .parallel(
          cc.tween().repeatForever(
            cc.tween().by(0.5, {}, {
              progress: (t) => {
                let currentAngle = angle + t * 2 * Math.PI;
                star.x = mobPos.x + Math.cos(currentAngle) * radius;
                star.y = mobPos.y + this.node.height * 0.5 + Math.sin(currentAngle) * radius;
                return t;
              }
            })
          ),
          cc.tween().to(1.0, { opacity: 0 })
        )
        .call(() => {
          star.destroy();
        })
        .start();
    }
  },

  setStats(health, damage, speed) {
    this.health = health;
    this.maxHealth = health;
    this.damage = damage;
    this.speed = speed;
    if (this.healthBar) {
      this.healthBar.progress = 1;
    }
  },

  setType(typeName) {
    this.mobType = typeName;
  },
});