import Phaser from 'phaser'
import Button from '../Entities/Button'


function onMainGameClicked(self: MainMenu): void {
    self.onExit()
    
    self.game.scene.stop('MainMenu')
    self.game.scene.run('GameScene')
}

function onCreditsClicked(self: MainMenu): void {
    self.game.scene.switch('MainMenu', 'Credits')
}

function onSoundClicked(self: MainMenu): void {
    if (self.theme.isPlaying && !self.theme.isPaused) {
        self.theme.stop()
        self.music_button.setTexture('sound-off')
    } else {
        self.theme.play({ loop: true, delay: 0.25 })

        self.music_button.setTexture('sound-on')
    }
}

export default class MainMenu extends Phaser.Scene {
    private buttons: Button[]
    theme: Phaser.Sound.BaseSound
    music_button: Button

    constructor() {
        super('MainMenu')
        this.buttons = []
    }

    create(): void {
        this.theme = this.sound.add('menu-theme')
        this.theme.play({ loop: true, delay: 0.25, volume: 0.4 })
        this.add.image(0, 0, 'background').setOrigin(0, 0)
        this.add.image(this.scale.width / 2, 100, 'logo')

        this.buttons.push(new Button(this, this.scale.width / 2, 125 + 120, 'play', () => { onMainGameClicked(this); }))
        this.buttons.push(new Button(this, this.scale.width / 2, 125 + 255, 'credits', () => onCreditsClicked(this)))
        this.music_button = new Button(this, this.scale.width - 70, this.scale.height - 70, 'sound-on', () => onSoundClicked(this))
        this.buttons.push(this.music_button)

        let text = `
        Use arrows to move around
        Press C to open Craft Menu
        Press I to open Inventory
        Click on enemies to attack them
        `

        this.add.text(-20, 400, text, { fontFamily: 'pixellari', fontSize: '20px', color: '#000000', stroke: '#fff', strokeThickness: 1 })
    }

    onExit(): void {
        this.theme.destroy()
    }

}