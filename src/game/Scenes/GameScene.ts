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
import {spawnAtGrassTile, GameBaseScene} from './GameBaseScene'

export default class GameScene extends GameBaseScene {

    player: Player;
    portals: Array<Portal>;
    keyC: Phaser.Input.Keyboard.Key;
    keyTab: Phaser.Input.Keyboard.Key
    music: Array<Phaser.Sound.BaseSound>
    currentMusic: Phaser.Sound.BaseSound;

    constructor() {
        super('GameScene');
    }

    create(): void {
        super.create();
        this.player = new Player(this, this.physics.add.sprite(19 * 32, 14 * 32, 'player'));
        this.addPortals();
        this.addCollisionWithPortal(this.player.sprite);
        this.addEnemies(this.player);

        this.putItems();

        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyTab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        this.music = [];
        this.music.push(this.sound.add('roam2'))
        this.music.push(this.sound.add('roam1'))
        this.music.push(this.sound.add('attack'))


        this.scene.scene.children.bringToTop(this.player.sprite);
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
        super.update(time, delta);
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

    protected addBoss(player: Player, posX: number, posY: number, index: number, superboss: boolean = false) {
        super.addBoss(player, posX, posY, index, superboss);
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1].sprite);
    }

    protected setupEnemy(player: Player, sprite: Phaser.Physics.Arcade.Sprite, name: string, isle: number): void {
        super.setupEnemy(player, sprite, name, isle);
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1].sprite);
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

    private addPortals() {
        this.portals = [];

        this.addPortal(50, 61, 183, 5, 0);
        this.addPortal(134, 64, 159, 123, 1);
        this.addPortal(51, 108, 79, 65, 2);
    }

    private addPortal(tile1X: number, tile1Y: number, tile2X: number, tile2Y: number, stoneNo: number) {
        this.portals.push(new Portal('1', this.physics.add.sprite(tile1X * 32, tile1Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile2X * 32 - 90, tile2Y * 32 ), stoneNo));
        this.portals.push(new Portal(`2`, this.physics.add.sprite(tile2X * 32, tile2Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile1X * 32 - 90, tile1Y * 32), stoneNo));
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