import { Component, Input } from '@angular/core';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'cart-summary',
    templateUrl: './cartSummary.component.html'
})

export class CartSummaryComponent {
    @Input() customer: Customer;
}