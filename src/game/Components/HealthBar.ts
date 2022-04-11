import Phaser from 'phaser';
import Character from '../Entities/Character';
import Player from '../Entities/Player';
import Component from './Component';


export default class HealthBar implements Component {
    hpMax: number;

    self: Character;
    text: Phaser.GameObjects.Text;
    player: Player;
    range: number;

    constructor(player: Player, range: number) {
        this.player = player;
        this.range = range;
    }

    getName(): string {
        return 'hp-bar'
    }

    start(character: Character): void {
        let attributes = character.attributes;

        this.self = character;
        this.hpMax = this.self.attributes.hp;

        this.text = character.scene.add.text(character.x, character.y - 2 * this.self.width, attributes.hp.toString(), { fontFamily: 'pixellari', color: '#ffffff', backgroundColor: '#880000' });
        this.text.setVisible(false);
    }

    update(timeSinceLastFrame: number): void {
        this.updateHealthOnIncrease();

        if (this.self.isNearObject(this.player, this.range))
            this.show();
        else
            this.hide();
    }

    private show(): void {
        this.text.setVisible(true);
        this.text.setPosition(this.self.x, this.self.y - 1.5 * this.self.width);
        this.text.setText(Math.round(this.self.attributes.hp).toString() + "/" + Math.round(this.hpMax));
    }

    updateHealthOnIncrease(): void {
        if (this.self.attributes.hp >= this.hpMax)
            this.hpMax = this.self.attributes.hp;
    }

    hide(): void {
        this.text.setVisible(false);
    }
}