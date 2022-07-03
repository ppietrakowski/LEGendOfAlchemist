import Character from '../Entities/Character'
import Player from '../Entities/Player'
import Component from './Component'


export default class PlayerMovement implements Component {
    private input: Phaser.Types.Input.Keyboard.CursorKeys
    private character: Character
    private onStayAnimation: string
    private once = true
    constructor(private speed: Phaser.Math.Vector2) {
        this.speed = speed
    }

    getName(): string {
        return 'movement'
    }

    start(character: Character): void {
        let {keyboard} = character.scene.input

        this.onStayAnimation = 'player-front'
        this.character = character
        this.input = keyboard.createCursorKeys()

        character.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
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
        let {character} = this
        character.anims.play(frameName, true)
        character.setVelocity(velX, velY)
    }
}