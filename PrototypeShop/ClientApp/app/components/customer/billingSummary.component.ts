import { Component, Input } from '@angular/core';
import { BaseAddress } from '../../classes/address/BaseAddress';

@Component({
    selector: 'billing-summary',
    templateUrl: './billingSummary.component.html'
})
export class BillingSummaryComponent {
    @Input() address: BaseAddress | undefined;
}
