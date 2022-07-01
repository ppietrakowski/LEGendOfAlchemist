import { Scene } from "phaser"
import Button from "../Entities/Button"
import Player from '../Entities/Player'
import GameScene from "./GameScene"

export default class CharacterInfo extends Scene {

    private player: Player = null
    private container: Phaser.GameObjects.Container
    private background: Phaser.GameObjects.Sprite

    constructor() {
        super('CharacterInfo')
    }

    preload(): void {
        this.container = this.add.container(240, 60)
        this.container.setScrollFactor(0)

        this.background = this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0)
        this.container.add(this.background)
        this.background.setScale(1.6, 1.5)

        this.container.add(this.add.image(10, 80, 'playerIcon').setOrigin(0, 0))
    }

    create(): void {
        this.player = this.game.scene.getScene('GameScene').children.getByName('player') as Player

        this.container.add(this.add.text(10, 120, `health: ${Math.round(this.player.attributes.hp.value)}`))
        this.container.add(this.add.text(10, 140, `strength: ${Math.round(this.player.attributes.strength.value)}`))
        this.container.add(this.add.text(10, 160, `wisdom: ${Math.round(this.player.attributes.wisdom.value)}`))
        this.container.add(this.add.text(10, 180, `killed monsters: ${(this.game.scene.getScene('GameScene') as GameScene).killStatistics}`))

        let image = this.add.sprite(60, 220, 'back')
        let button = new Button(image)
        button.addClickListener(this.onBack, this)

        this.container.add(image.setScale(0.25, 0.25))
    }

    private onBack(self: CharacterInfo) {
        self.game.scene.stop('CharacterInfo')
    
        //self.scene.setVisible(false);
        self.game.scene.run('GameScene')
    }
}