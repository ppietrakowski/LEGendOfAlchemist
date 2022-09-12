import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import { Component } from './Component'


export default class PlayerMovement implements Component {
    private _input: Phaser.Types.Input.Keyboard.CursorKeys
    static readonly COMPONENT_NAME = 'movement'
    static readonly DefaultAnimationName = 'player-front'

    constructor(private readonly _player: Player, private readonly _speed: Phaser.Math.Vector2) {
        this._speed = _speed
        this.start()
    }

    getName(): string {
        return PlayerMovement.COMPONENT_NAME
    }

    destroy(): void {
        this._input = null
        this._player.off(GameObject.GAMEOBJECT_UPDATE, this.update, this)
    }

    private start(): void {
        const { keyboard } = this._player.scene.input
        this._input = keyboard.createCursorKeys()

        this._player.on(GameObject.GAMEOBJECT_UPDATE, this.update, this)
    }

    private onMovement(frameName: string, velX: number, velY: number) {
        if (!this._player.anims)
            return

        this._player.anims.play(frameName, true)
        this._player.setVelocity(velX, velY)
    }

    private applyMovement(deltaTime: number) {
        let speedX = 0
        let speedY = 0
        let animationName = PlayerMovement.DefaultAnimationName

        if (this._input.down.isDown) {
            animationName = 'player-front-run'
            speedY = this._speed.y * deltaTime
        } else if (this._input.up.isDown) {
            animationName = 'player-back-run'
            speedY = -this._speed.y * deltaTime
        } else if (this._input.left.isDown) {
            animationName = 'player-left-run'
            speedX = -this._speed.x * deltaTime
        }
        else if (this._input.right.isDown) {
            animationName = 'player-right-run'
            speedX = this._speed.x * deltaTime
        }
    
        this.onMovement(animationName, speedX, speedY)
    }

    update(deltaTime: number): void {
        deltaTime *= 20

        this.applyMovement(deltaTime)
    }
}