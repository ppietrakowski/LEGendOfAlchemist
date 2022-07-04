import Phaser from 'phaser'
import Button from '../Entities/Button'

export default class MainMenu extends Phaser.Scene {
    private readonly buttons: Button[]
    private theme: Phaser.Sound.BaseSound
    private music_button: Button

    constructor() {
        super('MainMenu')
        this.buttons = []
    }

    create(): void {
        this.theme = this.sound.add('menu-theme')
        this.theme.play({ loop: true, delay: 0.25, volume: 0.2 })
        this.add.image(0, 0, 'background').setOrigin(0, 0)
        this.add.image(this.scale.width / 2, 100, 'logo')

        this.buttons.push(new Button(this.add.sprite(this.scale.width / 2, 125 + 120, 'play')))
        this.buttons.push(new Button(this.add.sprite(this.scale.width / 2, 125 + 255, 'credits')))
        this.music_button = new Button(this.add.sprite(this.scale.width - 70, this.scale.height - 70, 'sound-on'))
        this.buttons.push(this.music_button)

        this.buttons[0].addClickListener(this.onMainGameClicked, this)
        this.buttons[1].addClickListener(this.onCreditsClicked, this)
        this.buttons[2].addClickListener(this.onSoundClicked, this)

        let text = `
        Use arrows to move around
        Press C to open Craft Menu
        Press I to open Inventory
        Click on enemies to attack them
        `

        this.add.text(-20, 400, text, { fontFamily: 'pixellari', fontSize: '20px', color: '#000000', stroke: '#fff', strokeThickness: 1 })
    }

    private onMainGameClicked(): void {
        this.theme.destroy()

        this.game.scene.stop('MainMenu')
        this.game.scene.run('GameScene')
    }

    private onCreditsClicked(): void {
        this.game.scene.switch('MainMenu', 'Credits')
    }

    private onSoundClicked(): void {
        if (this.theme.isPlaying && !this.theme.isPaused) {
            this.theme.stop()
            this.music_button.setNewImage(this.add.sprite(this.scale.width - 70, this.scale.height - 70, 'sound-off'))
        } else {
            this.theme.play({ loop: true, delay: 0.25 })
            this.music_button.setNewImage(this.add.sprite(this.scale.width - 70, this.scale.height - 70, 'sound-on'))
        }

        this.music_button.addClickListener(this.onSoundClicked, this)
    }
}