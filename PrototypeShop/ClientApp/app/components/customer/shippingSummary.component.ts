import { Component, Input } from '@angular/core';
import { ShippingAddress } from '../../classes/address/ShippingAddress';
import { BillingAddress } from '../../classes/address/BillingAddress';

@Component({
    selector: 'shipping-summary',
    templateUrl: './shippingSummary.component.html'
})
export class ShippingSummaryComponent {
    @Input() shippingAddress: ShippingAddress | undefined;
    @Input() billingAddress: BillingAddress | undefined;
    @Input() customerDetailsComplete: boolean = false;
}
