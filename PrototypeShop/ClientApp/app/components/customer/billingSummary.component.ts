import { Component, Input } from '@angular/core';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'billing-summary',
    templateUrl: './billingSummary.component.html'
})
export class BillingSummaryComponent {
    @Input() customer: Customer;
    @Input() customerDetailsComplete: boolean;
}
