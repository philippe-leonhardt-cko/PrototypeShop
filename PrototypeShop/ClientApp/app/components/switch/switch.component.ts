import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'switch',
    templateUrl: './switch.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true
        }
    ]
})
export class SwitchComponent implements ControlValueAccessor {
    @Input() label = 'switch';
    @Input('value') _value = false;
    onChange: any = () => { };
    onTouched: any = () => { };

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    constructor() { }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    writeValue(value: any) {
        if (value) {
            this.value = value;
        }
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    switch() {
        this.value = !this.value;
    }
}
