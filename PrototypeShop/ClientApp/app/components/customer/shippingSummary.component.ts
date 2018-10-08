import { Component, Input } from '@angular/core';
import { BaseAddress } from '../../classes/address/BaseAddress';

@Component({
    selector: 'shipping-summary',
    templateUrl: './shippingSummary.component.html'
})
export class ShippingSummaryComponent {
    @Input() shippingAddress: BaseAddress | undefined;
    @Input() billingAddress: BaseAddress | undefined;
    @Input() customerDetailsComplete: boolean = false;
}
