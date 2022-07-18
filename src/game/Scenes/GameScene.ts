import Phaser from 'phaser'
import Portal from '../Entities/Portal'
import { GameBaseScene } from './GameBaseScene'
import InventoryUi from './InventoryUi'

import BushSpawner from './BushSpawner'

import DefaultMusicPlayer from '../DefaultMusicPlayer'
import MusicPlayer from '../MusicPlayer'

import Attribute from '../Components/Attribute'
import Enemy from '../Entities/Enemy'
import EnemyFactory from '../Entities/EnemyFactory'

export default class GameScene extends GameBaseScene {
    private readonly portals: Portal[]
    private readonly musicPlayer: MusicPlayer

    private keyI: Phaser.Input.Keyboard.Key
    private hitSound: Phaser.Sound.BaseSound

    constructor() {
        super('GameScene')
        this.portals = []
        this.musicPlayer = new DefaultMusicPlayer()
    }

    create(): void {
        super.create()

        this.spawnGameObjects()
        this.addKeyListener()

        this.game.events.on(InventoryUi.INVENTORY_CLOSED, () => {
            this.scene.resume(this.scene.key)
        })
    }

    private addKeyListener() {
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this.keyI.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.game.scene.game.scene.run('Inventory')
            this.player.scene.game.scene.getScene('Inventory').scene.setVisible(true)
            this.game.scene.game.scene.pause('GameScene')
        })
    }

    private spawnGameObjects() {
        this.physics.add.collider(this.player, this.seaLayer)
        this.addPortals()
        this.enemyFactory = new EnemyFactory(this, this.player, this.seaLayer,
            this.portals.map(value => value.sprite))

        this.addCollisionWithPortal(this.player)
        this.putItems()

        this.children.bringToTop(this.player)
        this.initializeMusic()

        this.addEnemies()
    }

    private initializeMusic() {
        this.musicPlayer.addMusic(this.sound.add('roam2'))
            .addMusic(this.sound.add('roam1'))
            .addMusic(this.sound.add('attack'));

        this.hitSound = this.sound.add('player-slap');
    }

    protected addEnemies() {
        const MaxNormalEnemies = 50;

        for (let i = 0; i < MaxNormalEnemies; i++)
            this.addEnemy(i);

        this.enemyFactory.createBoss(43, 52, 0);
        this.enemyFactory.createBoss(161, 69, 1);
        this.enemyFactory.createBoss(116, 107, 2);
        this.enemyFactory.createBoss(104, 61, -1, true);
    }

    protected addEnemy(i: number): void {
        const enemy = this.enemyFactory.createRandomEnemy(i % 4)

        enemy.attributes.on(Attribute.CHARACTER_DEAD, () => {
            this.enemyKilled++
            this.enemyFactory.deleteEnemy(enemy)
        }, this)

        enemy.on(Enemy.ENEMY_ATTACKED, () => this.hitSound.play({ volume: 0.2 }))
    }


    private addCollisionWithPortal(sprite: Phaser.Physics.Arcade.Sprite): void {
        for (const portal of this.portals)
            this.physics.add.collider(sprite, portal.sprite)
    }

    private addPortals() {
        this.addPortal(50, 61, 183, 5, 0)
        this.addPortal(134, 64, 159, 123, 1)
        this.addPortal(51, 108, 79, 65, 2)

    }

    private addPortal(tile1X: number, tile1Y: number, tile2X: number, tile2Y: number, stoneNo: number) {
        this.portals.push(new Portal('1', this.physics.add.sprite(tile1X * 32, tile1Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile2X * 32 - 90, tile2Y * 32), stoneNo));
        this.portals.push(new Portal(`2`, this.physics.add.sprite(tile2X * 32, tile2Y * 32, 'portal'), this.player, new Phaser.Math.Vector2(tile1X * 32 - 90, tile1Y * 32), stoneNo));
    }

    private putItems(): void {
        const spawner = new BushSpawner(this, 100)
        spawner.putItems(this.seaLayer)
    }
}