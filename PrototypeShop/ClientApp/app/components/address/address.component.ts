import { Component, Input } from '@angular/core';
import { BaseAddress } from '../../classes/address/BaseAddress';

@Component({
    selector: 'address',
    templateUrl: './address.component.html'
})
export class AddressComponent {
    @Input() address: BaseAddress | undefined;
}
