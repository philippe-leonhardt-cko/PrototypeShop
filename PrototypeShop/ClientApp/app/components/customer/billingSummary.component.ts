import { Component, Input } from '@angular/core';
import { BaseAddress } from '../../classes/address/BaseAddress';

@Component({
    selector: 'billing-summary',
    templateUrl: './billingSummary.component.html'
})
export class BillingSummaryComponent {
    @Input() email: string | undefined;
    @Input() billingAddress: BaseAddress | undefined;
    @Input() customerDetailsComplete: boolean = false;
}
