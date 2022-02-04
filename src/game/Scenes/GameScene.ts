import Phaser from 'phaser';
import { getItemWithRandomEffect } from '../Entities/Items';
import Player from '../Entities/Player';
import Portal from '../Entities/Portal';
import { GameBaseScene } from './GameBaseScene';
import { addInformationText, runAndPause, spawnGameobjectAtTile } from './SceneUtils';



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
        this.physics.add.collider(this.player.sprite, this.seaLayer);
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

        if (!this.currentMusic.isPlaying)
            this.playNextMusic();

        this.handleKeyEvents();

        this.player.update(delta / 1000);
        super.update(time, delta);
        if (this.player.isDead())
            this.player.makeDead();
    }

    private playNextMusic(): void {
        let i = this.music.findIndex((v) => v === this.currentMusic);
        if (i === this.music.length - 1)
            i = -1;

        this.currentMusic = this.music[i + 1];
        this.currentMusic.play({ delay: 0.7 });
    }

    private handleKeyEvents(): void {
        if (this.keyC.isDown)
            runAndPause(this.game, 'Crafting', 'GameScene');

        if (this.keyTab.isDown)
            runAndPause(this.game, 'CharacterInfo', 'GameScene');
    }

    protected addBoss(player: Player, posX: number, posY: number, index: number, superboss: boolean = false) {
        super.addBoss(player, posX, posY, index, superboss);
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1].sprite);
        this.physics.add.collider(this.enemies[this.enemies.length - 1].sprite, this.seaLayer);
    }

    protected setupEnemy(player: Player, sprite: Phaser.Physics.Arcade.Sprite, name: string, isle: number): void {
        super.setupEnemy(player, sprite, name, isle);
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1].sprite);
        this.physics.add.collider(sprite, this.seaLayer);
    }


    private addCollisionWithPortal(sprite: Phaser.Physics.Arcade.Sprite): void {
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
        this.portals.push(new Portal('1', this.physics.add.sprite(tile1X * 32, tile1Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile2X * 32 - 90, tile2Y * 32), stoneNo));
        this.portals.push(new Portal(`2`, this.physics.add.sprite(tile2X * 32, tile2Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile1X * 32 - 90, tile1Y * 32), stoneNo));
    }

    private putItems(): void {

        // add 100 items 
        for (let i = 0; i < 100; i++) {
            let sprite = this.add.sprite(0, 0, 'bush');
            spawnGameobjectAtTile(i % 4, sprite, this.seaLayer);
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
        addInformationText(this, sprite.x, sprite.y, `You have received ${item.sprite.texture.key}`, 
            (text: Phaser.GameObjects.GameObject) => {text.destroy(); this.player.inventory.addItem(item)});
        sprite.destroy(true);
    }
}