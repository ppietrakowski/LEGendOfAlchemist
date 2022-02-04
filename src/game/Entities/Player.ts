import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import Inventory from '../Components/Inventory'
import PlayerCombat from '../Components/PlayerCombat'
import PlayerHealthBar from '../Components/PlayerHealthBar'
import PlayerMovement from '../Components/PlayerMovement'
import GameScene from '../Scenes/GameScene'
import Character from './Character'
import { addAnimation, generateFrame } from './Enemies'


export default class Player extends Character {
    gameScene: GameScene;

    constructor(scene: GameScene, sprite: Phaser.Physics.Arcade.Sprite) {
        super(sprite);
        this.gameScene = scene;

        this.addComponent(new Attribute(100, 50, 10));
        this.addComponent(new PlayerMovement(new Phaser.Math.Vector2(190, 190)));
        this.addComponent(new PlayerHealthBar(this));
        this.addComponent(new PlayerCombat());
        this.addComponent(new Inventory());

        sprite.setScrollFactor(1);

        sprite.scene.cameras.main.startFollow(sprite, true, 0.08, 0.08);

        this.start();
    }

    get inventory(): Inventory {
        return this.getComponent<Inventory>('inventory');
    }

    get combat(): PlayerCombat {
        return this.getComponent<PlayerCombat>('player-combat') as PlayerCombat;
    }

    start(): void {
        this.addAnimations();
        this.sprite.anims.play('player-front', false);

        this.sprite.scaleX = 1.5;
        this.sprite.scaleY = 1.5;
    }

    makeDead(): void {
        // for now just show dead screen
        this.sprite.scene.game.scene.run('DeadScene');

        this.gameScene.currentMusic.stop();

        this.sprite.scene.game.scene.stop('GameScene');
    }



    hasTeleportStone(index: number): boolean {
        let hasFound = false;

        for (let item of this.inventory.items) {
            if (item.sprite.name === `teleport-stone-` + index)
                hasFound = true;
        }

        return hasFound;
    }

    private addAnimations(): void {
        let anims = this.sprite.anims;

        addAnimation(this.sprite, 'player');

        generateFrame(anims, 'player', 'front', 0, 0).repeat = -1;
        generateFrame(anims, 'player', 'back', 4, 4).repeat = -1;
    }
}