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
        this.player = new Player(this, this.physics.add.sprite(220, 140, 'player'));
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

            this.setupEnemy(sprite, enemy)
        }

        let enemy = getRandomEnemyKey()
        let sprite = this.physics.add.sprite(200, 200, enemy);
        this.enemies.push(new Boss(enemy, 120, sprite, this.player, 0));
        this.player.getComponent<PlayerCombat>('player-combat').addEnemy(this.enemies[this.enemies.length - 1]);
    }

    private setupEnemy(sprite: Phaser.Physics.Arcade.Sprite, name: string): void {
        let enemy: Enemy;
        this.spawnEnemyAtGrassTile(sprite);

        enemy = new Enemy(name, 140, sprite, this.player);

        this.player.getComponent<PlayerCombat>('player-combat').addEnemy(enemy);

        this.addCollisionWithPortal(enemy.sprite);
        this.enemies.push(enemy);
    }

    private spawnEnemyAtGrassTile(sprite: Phaser.Physics.Arcade.Sprite): void {
        while (this.seaLayer.getTileAtWorldXY(sprite.x, sprite.y) != null) {
            sprite.x = Math.round(Phaser.Math.Between(1, 4000));
            sprite.y = Math.round(Phaser.Math.Between(1, 3000));
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
        this.seaLayer.setCollisionBetween(0, 2);
        this.seaLayer.setCollisionBetween(5, 5);
        this.seaLayer.setCollisionBetween(7, 7);
        this.seaLayer.setCollisionBetween(10, 14);

    }

    private addPortals() {
        this.portals = [];
        this.portals.push(new Portal(`1`, this.physics.add.sprite(650, 200, 'portal'), this.player, new Phaser.Math.Vector2(2700, 1500), 0));
        this.portals.push(new Portal(`1`, this.physics.add.sprite(2790, 1550, 'portal'), this.player, new Phaser.Math.Vector2(580, 200), 0));
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
            while (this.seaLayer.getTileAtWorldXY(sprite.x, sprite.y) != null) {
                sprite.x = Math.round(Phaser.Math.Between(1, 4000));
                sprite.y = Math.round(Phaser.Math.Between(1, 3000));
            }
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
        let item = getItemWithRandomEffect(0, 0, this);
        let text = this.add.text(sprite.x, sprite.y, 'You have received ' + item.sprite.texture.key);

        this.tweens.add({
            targets: [text],
            y: '-= 100',
            duration: 500,
            ease: 'linear',
            onComplete: () => {
                this.player.inventory.addItem(item)
                text.destroy();
            }
        })
        sprite.destroy(true);
    }
}