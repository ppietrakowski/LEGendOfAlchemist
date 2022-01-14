import Phaser from 'phaser'
import Character from './Character'
import Component from './Component'
import Player from './Player';


export default class HealthBar implements Component {
    hp: number;
    self: Character;
    text: Phaser.GameObjects.Text;
    player: Player;
    range: number;

    constructor(player: Player, range: number) {
        this.player = player;
        this.range = range;
    }

    debugName(): string {
        return 'HP-BAR'
    }

    getName(): string {
        return 'hp-bar'
    }

    start(character: Character): void {
        let attributes = character.attributes;
        this.self = character;

        
        this.text = character.sprite.scene.add.text(character.sprite.x, character.sprite.y - 2 * this.self.sprite.width, attributes.hp.toString(), {color: '#000000', backgroundColor: '#880000'});
        this.text.setVisible(false);
    }

    update(timeSinceLastFrame: number): void {

        if (this.self.isNearObject(this.player.sprite, this.range)) {
            this.text.setVisible(true);
            this.text.setPosition(this.self.sprite.x, this.self.sprite.y - 2 * this.self.sprite.width);
            this.text.setText(Math.round(this.self.attributes.hp).toString());
        } else
            this.text.setVisible(false);
    }

    
}