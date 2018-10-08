import { Component, Input } from '@angular/core';
import { BillingAddress } from '../../classes/address/BillingAddress';

@Component({
    selector: 'billing-summary',
    templateUrl: './billingSummary.component.html'
})
export class BillingSummaryComponent {
    @Input() email: string | undefined;
    @Input() billingAddress: BillingAddress | undefined;
    @Input() customerDetailsComplete: boolean = false;
}
