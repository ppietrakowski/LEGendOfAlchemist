import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';
import Portal from '../Entities/Portal';
import Boss from '../Entities/Boss'

import PlayerCombat from '../Components/PlayerCombat';
import { getRandomEnemyKey } from '../Entities/Enemies';
import Ingredient from '../Entities/Ingredient';
import Effect from '../Components/Effect';
import { getItemWithRandomEffect } from '../Entities/Items';
import UltraBoss from '../Entities/UltraBoss'

export default class GameScene extends Phaser.Scene {

    player: Player;
    enemies: Array<Enemy>;
    portals: Array<Portal>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    seaLayer: Phaser.Tilemaps.TilemapLayer;
    keyC: Phaser.Input.Keyboard.Key;
    keyTab: Phaser.Input.Keyboard.Key
    music: Array<Phaser.Sound.BaseSound>
    currentMusic: Phaser.Sound.BaseSound;
    enemyKilled = 0

    constructor() {
        super('GameScene');
    }

    create(): void {
        this.cameras.main.setBounds(0, 0, 7168, 5120);
        this.map = this.make.tilemap({ key: 'island' });
        this.tileset = this.map.addTilesetImage('textures', 'main-island');

        this.map.createLayer('island', this.tileset, -100, -100);
        this.seaLayer = this.map.createLayer('sea', this.tileset, -100, -100);
        this.player = new Player(this, this.physics.add.sprite(19 * 32, 14 * 32, 'player'));
        this.addPortals();
        this.addEnemies();
        this.addCollision();

        this.putItems();

        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyTab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);


        this.music = [];
        this.music.push(this.sound.add('roam2'))
        this.music.push(this.sound.add('roam1'))
        this.music.push(this.sound.add('attack'))


        this.currentMusic = this.music[0];
        this.currentMusic.play();
    }

    update(time: number, delta: number): void {

        if (!this.currentMusic.isPlaying) {
            var i = this.music.findIndex((v) => v === this.currentMusic);
            if (i === this.music.length - 1)
                i = -1;

            this.currentMusic = this.music[i + 1];
            this.currentMusic.play({ delay: 0.7 });
        }

        if (this.keyC.isDown)
            this.runCrafting();

        if (this.keyTab.isDown)
            this.runInventory();

        this.player.update(delta / 1000);
        for (let i of this.enemies)
            this.updateEnemy(i, delta);
        if (this.player.isDead())
            this.player.makeDead();
    }

    private runCrafting() {
        this.game.scene.run('Crafting');
        this.game.scene.getScene('Crafting').scene.setVisible(true);
        this.game.scene.pause('GameScene');
    }

    private runInventory(): void {
        this.game.scene.run('CharacterInfo');
        this.game.scene.getScene('CharacterInfo').scene.setVisible(true);
        this.game.scene.pause('GameScene');
    }

    private deleteEnemy(enemy: Enemy) {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] === enemy)
                this.enemies.splice(i, 1);
        }
    }

    private addEnemies() {
        this.enemies = [];
        for (let i = 0; i < 50; i++) {
            let enemy = getRandomEnemyKey()
            let sprite = this.physics.add.sprite(0, 0, enemy);

            this.setupEnemy(sprite, enemy, i % 4);
        }
        this.addBoss(43 * 32, 52 * 32, 0);
        this.addBoss(161 * 32, 69 * 32, 1);
        this.addBoss(116 * 32, 107 * 32, 2);
        this.addBoss(104 * 32, 61 * 32, -1, true);
    }

    private addBoss(posX: number, posY: number, index: number, superboss: boolean = false) {
        let enemy = getRandomEnemyKey()
        let sprite = this.physics.add.sprite(posX, posY, enemy);
        if (!superboss)
            this.enemies.push(new Boss(enemy, 120, sprite, this.player, index));
        else
            this.enemies.push(new UltraBoss(enemy, 120, sprite, this.player));
        this.player.getComponent<PlayerCombat>('player-combat').addEnemy(this.enemies[this.enemies.length - 1]);
        this.addCollisionWithPortal(sprite);
    }

    private setupEnemy(sprite: Phaser.Physics.Arcade.Sprite, name: string, isle: number): void {
        let enemy: Enemy;
        this.spawnEnemyAtGrassTile(isle, sprite);

        enemy = new Enemy(name, 140, sprite, this.player);

        this.player.getComponent<PlayerCombat>('player-combat').addEnemy(enemy);

        this.addCollisionWithPortal(enemy.sprite);
        this.enemies.push(enemy);
    }

    private spawnEnemyAtGrassTile(isle: number, sprite: Phaser.Physics.Arcade.Sprite): void {
        while (this.seaLayer.getTileAtWorldXY(Math.round(sprite.x), Math.round(sprite.y)) != null) {
            if (isle === 0) {
                sprite.x = Math.round(Phaser.Math.Between(9, 68)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(6, 53)) * 32;
            } else if (isle === 1) {
                sprite.x = Math.round(Phaser.Math.Between(132, 213)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(33, 80)) * 32;
            } else if (isle === 2) {
                sprite.x = Math.round(Phaser.Math.Between(12, 144)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(111, 155)) * 32;
            } else {
                sprite.x = Math.round(Phaser.Math.Between(66, 115)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(59, 68)) * 32;
            }
        }
    }

    private spawnAtGrassTile(isle: number, sprite: Phaser.GameObjects.Sprite): void {
        while (this.seaLayer.getTileAtWorldXY(Math.round(sprite.x), Math.round(sprite.y)) != null) {
            if (isle === 0) {
                sprite.x = Math.round(Phaser.Math.Between(9, 68)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(6, 53)) * 32;
            } else if (isle === 1) {
                sprite.x = Math.round(Phaser.Math.Between(132, 213)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(33, 80)) * 32;
            } else if (isle === 2) {
                sprite.x = Math.round(Phaser.Math.Between(12, 144)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(111, 155)) * 32;
            } else {
                sprite.x = Math.round(Phaser.Math.Between(66, 115)) * 32;
                sprite.y = Math.round(Phaser.Math.Between(59, 68)) * 32;
            }
        }
    }

    private addCollisionWithPortal(sprite: Phaser.Physics.Arcade.Sprite): void {
        this.physics.add.collider(sprite, this.seaLayer);
        for (let portal of this.portals) {
            this.physics.add.collider(sprite, portal.sprite);
        }
    }

    private addCollision(): void {
        this.physics.add.collider(this.player.sprite, this.seaLayer);
        this.seaLayer.setCollisionBetween(0, 7);
        this.seaLayer.setCollisionBetween(8, 8);
        this.seaLayer.setCollisionBetween(10, 15);
        this.seaLayer.setCollisionBetween(16, 23);
        this.seaLayer.setCollisionBetween(29, 30);

    }

    private addPortals() {
        this.portals = [];

        this.addPortal(50, 61, 183, 5, 0);
        this.addPortal(134, 64, 159, 123, 1);
        this.addPortal(51, 108, 81, 70, 2);
    }

    private addPortal(tile1X: number, tile1Y: number, tile2X: number, tile2Y: number, stoneNo: number) {
        this.portals.push(new Portal('1', this.physics.add.sprite(tile1X * 32, tile1Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile2X * 32 - 90, tile2Y * 32 ), stoneNo));
        this.portals.push(new Portal(`2`, this.physics.add.sprite(tile2X * 32, tile2Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile1X * 32 - 90, tile1Y * 32), stoneNo));
    }

    private updateEnemy(enemy: Enemy, deltaTime: number) {
        enemy.update(deltaTime / 1000);

        if (enemy.isDead()) {
            this.enemyKilled++;
            enemy.makeDead();
            this.deleteEnemy(enemy);
        }
    }

    private putItems(): void {

        // add 100 items 
        for (let i = 0; i < 100; i++) {
            let sprite = this.add.sprite(0, 0, 'bush');
            this.spawnAtGrassTile(i % 4, sprite);
            sprite.setInteractive({ pixelPerfect: true });

            sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {

                if (this.player.inventory.hasFreeSpace()) {
                    this.throwAway(sprite);
                } else
                    this.player.inventory.showCannotGatherInfo();
            });
        }
    }

    throwAway(sprite: Phaser.GameObjects.Sprite) {
        let item = getItemWithRandomEffect(-10, -10, this);
        let text = this.add.text(sprite.x, sprite.y, 'You have received ' + item.sprite.texture.key);

        this.tweens.add({
            targets: [text],
            y: '-= 100',
            duration: 500,
            ease: 'linear',
            onComplete: () => {
                this.player.inventory.addItem(item);
                text.destroy();
            }
        })
        sprite.destroy(true);
    }
}