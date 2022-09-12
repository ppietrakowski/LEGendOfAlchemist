import Phaser from 'phaser'
import Button from '../Entities/Button'

export default class MainMenu extends Phaser.Scene {
    private readonly _buttons: Button[]
    private _theme: Phaser.Sound.BaseSound
    private _musicButton: Button

    constructor() {
        super('MainMenu')
        this._buttons = []
    }

    create(): void {
        this._theme = this.sound.add('menu-theme')
        this._theme.play({ loop: true, delay: 0.25, volume: 0.2 })
        this.add.image(0, 0, 'background').setOrigin(0, 0)
        this.add.image(this.scale.width / 2, 100, 'logo')

        this._buttons.push(new Button(this.add.sprite(this.scale.width / 2, 125 + 120, 'play')))
        this._buttons.push(new Button(this.add.sprite(this.scale.width / 2, 125 + 255, 'credits')))
        this._musicButton = new Button(this.add.sprite(this.scale.width - 70, this.scale.height - 70, 'sound-on'))
        this._buttons.push(this._musicButton)

        this._buttons[0].addClickListener(this.mainGameButtonClicked, this)
        this._buttons[1].addClickListener(this.creditsButtonClicked, this)
        this._buttons[2].addClickListener(this.soundButtonClicked, this)

        const text = `
        Use arrows to move around
        Press C to open Craft Menu
        Press I to open Inventory
        Click on enemies to attack them
        `

        this.add.text(-20, 400, text, { fontFamily: 'pixellari', fontSize: '20px', color: '#000000', stroke: '#fff', strokeThickness: 1 })
    }

    private mainGameButtonClicked(): void {
        this._theme.destroy()

        this.game.scene.stop('MainMenu')
        this.game.scene.run('GameScene')
    }

    private creditsButtonClicked(): void {
        this.game.scene.switch('MainMenu', 'Credits')
    }

    private soundButtonClicked(): void {
        if (this._theme.isPlaying && !this._theme.isPaused) {
            this._theme.stop()
            this._musicButton.setNewImage(this.add.sprite(this.scale.width - 70, this.scale.height - 70, 'sound-off'))
        } else {
            this._theme.play({ loop: true, delay: 0.25 })
            this._musicButton.setNewImage(this.add.sprite(this.scale.width - 70, this.scale.height - 70, 'sound-on'))
        }

        this._musicButton.addClickListener(this.soundButtonClicked, this)
    }
}