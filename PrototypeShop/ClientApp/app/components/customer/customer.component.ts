import { Component, Input, OnInit } from '@angular/core';
import { Customer } from './customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';

@Component({
    selector: 'customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
    public customer: Customer | undefined;
    @Input() isSummary: boolean = true;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.customer = cart.customer;
            }
        )
    }
}
