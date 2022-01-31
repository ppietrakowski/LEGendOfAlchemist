
import EnemyController from '../Components/EnemyController';
import Boss from './Boss'
import Player from './Player';

export default class UltraBoss extends Boss {
    constructor(name: string, maxRange: number, sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(name, maxRange, sprite, player, -1);
        sprite.setScale(2, 2);
        sprite.setTint(0xff0000);
    }


    makeDead(): void {
        var gameScene = this.getComponent<EnemyController>('enemy-movement').target.gameScene;

           // for now just show dead screen
        this.sprite.scene.game.scene.run('WinScene');

        gameScene.currentMusic.stop();

        this.sprite.scene.game.scene.stop('GameScene');
    }
}