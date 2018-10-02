import { Component, Input } from '@angular/core';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'customer-summary',
    templateUrl: './customerSummary.component.html'
})
export class CustomerSummaryComponent {
    @Input() customer: Customer;
    @Input() customerDetailsComplete: boolean;
}
