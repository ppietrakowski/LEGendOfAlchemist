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

import { ItemSpawner } from '../Entities/ItemSpawner'

export default class GameScene extends GameBaseScene {
    private readonly _portals: Portal[]
    private readonly _musicPlayer: MusicPlayer

    private _keyI: Phaser.Input.Keyboard.Key
    private _hitSound: Phaser.Sound.BaseSound

    constructor() {
        super('GameScene')
        this._portals = []
        this._musicPlayer = new DefaultMusicPlayer()
    }

    create(): void {
        super.create()

        this.spawnGameObjects()
        this.addKeyListener()

        this.game.events.on(InventoryUi.INVENTORY_CLOSED, () => this.scene.resume(this.scene.key))

        this._player.attributes.on(Attribute.CHARACTER_DEAD, () => this.scene.switch('Credits'))
        
        this.data.set('spawner', new ItemSpawner(this))
    }

    private addKeyListener() {
        this._keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this._keyI.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.game.scene.game.scene.run('Inventory')
            this._player.scene.game.scene.getScene('Inventory').scene.setVisible(true)
            this.game.scene.game.scene.pause('GameScene')
        })
    }

    private addPortal(tile1X: number, tile1Y: number, tile2X: number, tile2Y: number, stoneNo: number) {
        this._portals.push(new Portal('1', this.physics.add.sprite(tile1X * 32, tile1Y * 32, 'portal'), this._player, new Phaser.Math.Vector2(tile2X * 32 - 90, tile2Y * 32), stoneNo))
        this._portals.push(new Portal('2', this.physics.add.sprite(tile2X * 32, tile2Y * 32, 'portal'), this._player, new Phaser.Math.Vector2(tile1X * 32 - 90, tile1Y * 32), stoneNo))
    }

    private addPortals() {
        this.addPortal(50, 61, 183, 5, 0)
        this.addPortal(134, 64, 159, 123, 1)
        this.addPortal(51, 108, 79, 65, 2)
    }

    private addCollisionWithPortal(sprite: Phaser.Physics.Arcade.Sprite): void {
        for (const portal of this._portals)
            this.physics.add.collider(sprite, portal.sprite)
    }

    private putItems(): void {
        const spawner = new BushSpawner(this, 100)
        spawner.putItems(this._seaLayer)
    }

    private initializeMusic() {
        this._musicPlayer.addMusic(this.sound.add('roam2'))
            .addMusic(this.sound.add('roam1'))
            .addMusic(this.sound.add('attack'))

        this._hitSound = this.sound.add('player-slap')
    }

    protected addEnemy(i: number): void {
        const enemy = this._enemyFactory.createRandomEnemy(i % 4)

        enemy.attributes.on(Attribute.CHARACTER_DEAD, () => this._enemyKilled++)

        enemy.on(Enemy.ENEMY_ATTACKED, () => this._hitSound.play({ volume: 0.2 }))
    }

    protected addEnemies() {
        const MaxNormalEnemies = 50

        for (let i = 0; i < MaxNormalEnemies; i++)
            this.addEnemy(i)

        this._enemyFactory.createBoss(43, 52, 0)
        this._enemyFactory.createBoss(161, 69, 1)
        this._enemyFactory.createBoss(116, 107, 2)
        this._enemyFactory.createBoss(104, 61, -1, true)
    }

    private spawnGameObjects() {
        this.physics.add.collider(this._player, this._seaLayer)
        this.addPortals()
        this._enemyFactory = new EnemyFactory(this, this._player, this._seaLayer,
            this._portals.map(value => value.sprite))

        this.addCollisionWithPortal(this._player)
        this.putItems()

        this.children.bringToTop(this._player)
        this.initializeMusic()

        this.addEnemies()
    }
}