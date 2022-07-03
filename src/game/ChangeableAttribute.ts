
import Phaser from 'phaser'

/**
 * Class for reading and writting value
 * It's used to send event, when value changed
 */
export default class ChangeableAttribute<T> extends Phaser.Events.EventEmitter {

    /**
     * Name of event
     * 
     * It's delegate can look like:
     * valueChanged(previousValue: T): void
     */
    static AttributeChanged = 'Changed'

    constructor(protected property: T) { super() }

    get value(): T { return this.property }
    set value(newValue: T) { 
        let temp = this.property
        this.property = newValue
        this.emit(ChangeableAttribute.AttributeChanged, temp)
    }
}