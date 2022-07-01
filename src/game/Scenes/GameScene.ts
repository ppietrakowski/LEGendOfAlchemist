import Phaser from 'phaser'
import Portal from '../Entities/Portal'
import { GameBaseScene } from './GameBaseScene'
import InventoryUi from './InventoryUi'

import BushSpawner from './BushSpawner'


export default class GameScene extends GameBaseScene {
    private portals: Portal[]
    private music: Phaser.Sound.BaseSound[]
    private currentMusic: Phaser.Sound.BaseSound
    private keyI: Phaser.Input.Keyboard.Key

    constructor() {
        super('GameScene');
    }

    preload(): void {
        super.preload()
    }

    create(): void {
        super.create()

        this.physics.add.collider(this.player, this.seaLayer)
        this.addPortals()
        this.addCollisionWithPortal(this.player)
        this.putItems()

        this.children.bringToTop(this.player)
        this.initializeMusic()

        this.addEnemies()

        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this.keyI.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.game.scene.game.scene.run('Inventory')
            this.player.scene.game.scene.getScene('Inventory').scene.setVisible(true)
            this.game.scene.game.scene.pause('GameScene')
        })

        this.game.events.on(InventoryUi.InventoryClosed, () => {
            this.scene.resume(this.scene.key)
        })
    }

    private initializeMusic() {
        this.music = [this.sound.add('roam2'), this.sound.add('roam1'), this.sound.add('attack')]

        this.currentMusic = this.music[0]

        this.currentMusic.on(Phaser.Sound.Events.STOP, this.playNextMusic, this)
        this.currentMusic.play({ volume: 0.2 })
    }

    update(time: number, delta: number): void {
        /* Scale it to seconds */
        delta *= 0.001

        this.player.update(delta)
        super.update(time, delta)

        console.log(1 / delta)
    }

    private playNextMusic(): void {
        let i = this.music.findIndex((v) => v === this.currentMusic)
        if (i === this.music.length - 1)
            i = -1

        this.currentMusic = this.music[i + 1]
        this.currentMusic.play({ delay: 0.7 })
    }

    protected addBoss(posX: number, posY: number, index: number, superboss: boolean = false) {
        super.addBoss(posX, posY, index, superboss)
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1])
        this.physics.add.collider(this.enemies[this.enemies.length - 1], this.seaLayer)
    }

    protected addEnemy(i: number): void {
        super.addEnemy(i)
        this.addCollisionWithPortal(this.enemies[this.enemies.length - 1])
        this.physics.add.collider(this.enemies[this.enemies.length - 1], this.seaLayer, () => this.enemies[this.enemies.length - 1].emit('CollideSea'))
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