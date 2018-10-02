import { Component, Input } from '@angular/core';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'shipping-summary',
    templateUrl: './shippingSummary.component.html'
})
export class ShippingSummaryComponent {
    @Input() customer: Customer;
    @Input() customerDetailsComplete: boolean;
}
