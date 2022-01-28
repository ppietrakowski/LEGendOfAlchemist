import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';
import Portal from '../Entities/Portal';

import PlayerCombat from '../Components/PlayerCombat';

export default class GameScene extends Phaser.Scene {

    player: Player;
    enemies: Array<Enemy>;
    portals: Array<Portal>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    seaLayer: Phaser.Tilemaps.TilemapLayer;
    keyC: Phaser.Input.Keyboard.Key;

    constructor() {
        super('GameScene');
    }

    create(): void {
        this.map = this.make.tilemap({ key: 'island' });
        this.tileset = this.map.addTilesetImage('textures', 'main-island');
        this.seaLayer = this.map.createLayer('sea', this.tileset, -100, -100);
        this.map.createLayer('island', this.tileset, -100, -100);

        this.player = new Player(this, this.physics.add.sprite(220, 140, 'player'));
        this.addPortals();
        this.addEnemies();
        this.addCollision();
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update(time: number, delta: number): void {

        if (this.keyC.isDown) {
            this.game.scene.run('Crafting');
            this.game.scene.getScene('Crafting').scene.setVisible(true);
            this.game.scene.pause('GameScene');
        }

        this.player.update(delta / 1000);
        for (let i of this.enemies)
            this.updateEnemy(i, delta);
        if (this.player.isDead())
            this.player.makeDead();
    }

    private deleteEnemy(enemy: Enemy) {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] === enemy)
                this.enemies.splice(i, 1);
        }
    }

    private addEnemies() {
        this.enemies = [];
        for (let i = 0; i < 10; i++) {
            let sprite = this.physics.add.sprite(0, 0, 'shark');
            
            

            while (this.seaLayer.getTileAtWorldXY(sprite.x, sprite.y) != null) {     
                sprite.x = Math.round(Phaser.Math.Between(1, 4000));
                sprite.y = Math.round(Phaser.Math.Between(1, 3000));
            }

            console.log(sprite.x + " " + sprite.y);

            this.enemies.push(new Enemy(`shark`, 120, sprite, this.player));
            this.player.getComponent<PlayerCombat>('player-combat').addEnemy(this.enemies[i]);

            this.physics.add.collider(this.enemies[i].sprite, this.seaLayer);
            for (let portal of this.portals) {
                this.physics.add.collider(this.enemies[i].sprite, portal.sprite);
            }
        }
    }

    private addCollision() {
        this.physics.add.collider(this.player.sprite, this.seaLayer);
        this.seaLayer.setCollisionBetween(48, 51);
        this.seaLayer.setCollisionBetween(56, 59);
    }

    private addPortals() {
        this.portals = [];
        this.portals.push(new Portal(`1`, this.physics.add.sprite(650, 200, 'portal'), this.player, new Phaser.Math.Vector2(2500, 1500)));
    }

    private updateEnemy(enemy: Enemy, deltaTime: number) {
        enemy.update(deltaTime / 1000);

        if (enemy.isDead()) {
            enemy.makeDead();
            this.deleteEnemy(enemy);
        }
    }
}