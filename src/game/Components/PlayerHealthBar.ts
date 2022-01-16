import HealthBar from './HealthBar';

import Character from '../Entities/Character';
import Player from '../Entities/Player';


export default class PlayerHealthBar extends HealthBar {

    constructor(player: Player) {
        super(player, 100);
    }

    start(character: Character): void {
        this.text = character.sprite.scene.add.text(20, 20,
             this.player.attributes.hp.toString(), {color: '#000000',
               backgroundColor: '#880000', fontSize: '16px'});
            
        this.text.setScrollFactor(0);
        this.hpMax = character.attributes.hp;
        this.self = this.player;
    }
    
    update(timeSinceLastFrame: number): void {
        this.updateHealthOnIncrease();
        this.text.setText(Math.round(this.player.attributes.hp).toString() + "/" + this.hpMax);
    }
}