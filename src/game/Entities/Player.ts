import Phaser from 'phaser'

import GameScene from '../Scenes/GameScene'

import Character from './Character'

import PlayerMovement from '../Components/PlayerMovement'
import Attribute from '../Components/Attribute'
import PlayerHealthBar from '../Components/PlayerHealthBar'
import PlayerCombat from '../Components/PlayerCombat'
import Inventory from '../Components/Inventory'

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
        this.sprite.anims.play('front', false);

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
        var hasFound = false;

        for (let item of this.inventory.items) {
            if (item.sprite.name === `teleport-stone-` + index)
                hasFound = true;
        }

        return hasFound;
    }

    private addAnimations(): void {
        let anims = this.sprite.anims;
        anims.create(
            {
                key: 'front',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
                repeat: -1,
                frameRate: 4
            });

        anims.create(
            {
                key: 'front-run',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 4
            });


        anims.create(
            {
                key: 'back',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                repeat: -1,
                frameRate: 4
            });

        anims.create(
            {
                key: 'back-run',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }),
                repeat: -1,
                frameRate: 4
            });

        anims.create(
            {
                key: 'left-run',
                frames: anims.generateFrameNumbers('player', { start: 12, end: 15 }),
                repeat: -1,
                frameRate: 4
            });

        anims.create(
            {
                key: 'right-run',
                frames: anims.generateFrameNumbers('player', { start: 8, end: 11 }),
                repeat: -1,
                frameRate: 4
            });
    }
}