import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import {Component, addToUpdateList} from './Component'


export default class PlayerMovement implements Component {
    private input: Phaser.Types.Input.Keyboard.CursorKeys
    private onStayAnimation: string

    constructor(private readonly player: Player, private readonly speed: Phaser.Math.Vector2) {
        this.speed = speed

        this.start()
    }

    getName(): string {
        return 'movement'
    }

    private start(): void {
        let {keyboard} = this.player.scene.input

        this.onStayAnimation = 'player-front'
        this.input = keyboard.createCursorKeys()

        addToUpdateList(this.player.scene, this.update, this)
    }

    update(_time: number, deltaTime: number): void {
        deltaTime *= 0.05
        if (this.input.down.isDown) {
            this.onMovement('player-front-run', 0, this.speed.y * deltaTime)
            this.onStayAnimation = 'player-front'
        } else if (this.input.up.isDown) {
            this.onMovement('player-back-run', 0, -this.speed.y * deltaTime)
            this.onStayAnimation = 'player-back'
        } else if (this.input.left.isDown) {
            this.onMovement('player-left-run', -this.speed.x * deltaTime, 0)
            this.onStayAnimation = 'player-front'
        }
        else if (this.input.right.isDown) {
            this.onMovement('player-right-run', this.speed.x * deltaTime, 0)
            this.onStayAnimation = 'player-front'
        }
        else
            this.onMovement(this.onStayAnimation, 0, 0)
    }

    private onMovement(frameName: string, velX: number, velY: number) {
        this.player.anims.play(frameName, true)
        this.player.setVelocity(velX, velY)
    }
}