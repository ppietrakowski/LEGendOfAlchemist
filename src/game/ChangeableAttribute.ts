
import Phaser from 'phaser'

export default class ChangeableAttribute<T> extends Phaser.Events.EventEmitter {

    static AttributeChanged = 'Changed'

    constructor(protected property: T) { super() }

    get value(): T { return this.property }
    set value(newValue: T) { 
        let temp = this.property
        this.property = newValue
        this.emit(ChangeableAttribute.AttributeChanged, temp)
    }
}