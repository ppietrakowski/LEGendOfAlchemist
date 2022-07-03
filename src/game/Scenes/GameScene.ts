import Phaser from 'phaser'
import Portal from '../Entities/Portal'
import { GameBaseScene } from './GameBaseScene'
import InventoryUi from './InventoryUi'

import BushSpawner from './BushSpawner'

import DefaultMusicPlayer from '../DefaultMusicPlayer'
import MusicPlayer from '../MusicPlayer'

export default class GameScene extends GameBaseScene {
    private portals: Portal[]
    private keyI: Phaser.Input.Keyboard.Key
    private readonly musicPlayer: MusicPlayer = new DefaultMusicPlayer()

    constructor() {
        super('GameScene')
    }

    create(): void {
        super.create()

        this.spawnGameObjects()

        this.addKeyListener()

        this.game.events.on(InventoryUi.InventoryClosed, () => {
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
        this.addCollisionWithPortal(this.player)
        this.putItems()

        this.children.bringToTop(this.player)
        this.initializeMusic()

        this.addEnemies()
    }

    private initializeMusic() {
        this.musicPlayer.addMusic(this.sound.add('roam2'))
            .addMusic(this.sound.add('roam1'))
            .addMusic(this.sound.add('attack'))
    }

    protected addBoss(posX: number, posY: number, index: number, superboss: boolean = false) {
        super.addBoss(posX, posY, index, superboss)
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1])
        this.physics.add.collider(this.enemies[this.enemies.length - 1], this.seaLayer)
    }

    protected addEnemy(i: number): void {
        super.addEnemy(i)
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1])
        this.physics.add.collider(this.enemies[this.enemies.length - 1], this.seaLayer)
    }


    private addCollisionWithPortal(sprite: Phaser.Physics.Arcade.Sprite): void {
        for (let portal of this.portals)
            this.physics.add.collider(sprite, portal.sprite)
    }

    private addPortals() {
        this.portals = []

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