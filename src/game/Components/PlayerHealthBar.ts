import HealthBar from './HealthBar';

import Character from '../Entities/Character';
import Player from '../Entities/Player';


export default class PlayerHealthBar extends HealthBar {

    constructor(player: Player) {
        super(player, 100);
    }

    start(character: Character): void {
        this.text = character.sprite.scene.add.text(20, 20,
             this.player.attributes.hp.toString(), {fontFamily: 'pixellari', color: '#000000',
               backgroundColor: '#880000', fontSize: '16px'});
            
        this.text.setScrollFactor(0);
        this.hpMax = character.attributes.hp;
        this.self = this.player;
    }
    
    update(timeSinceLastFrame: number): void {
        let hpText = Math.round(this.player.attributes.hp) + "/" + Math.round(this.hpMax);
        this.updateHealthOnIncrease();
        this.text.setText(hpText);
    }
}