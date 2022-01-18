import Effect from "../Components/Effect";
import Ingredient from "./Ingredient";
import Item from "./Item";

export const Items = [
    'cherries',
    'orange',
    'red_flower',
    'potion'
]

export function getRandomItemIndex() {
    let index = Math.round( Math.random() * (Items.length - 1) );
    return index;
}

export function loadItems(scene) {
    for (let i of Items) {
        console.warn(`assets/items/${i}.png`);
        scene.load.image(i, `assets/items/${i}.png`);
    }
}

export function getItemWithRandomEffect(x, y, scene) {
    let index = getRandomItemIndex();
    let hp = Math.ceil(Math.random() * (10 + 10) - 10);
    let strength = Math.ceil(Math.random() * (10 + 10) - 10);
    let wisdom = Math.ceil(Math.random() * (10 + 10) - 10);
    let time = Math.floor(Math.random() * (2 + 1) - 1);

    return new Ingredient(new Effect(hp, strength, wisdom, time), scene.physics.add.sprite(x, y, Items[index]).setOrigin(0, 0));
}