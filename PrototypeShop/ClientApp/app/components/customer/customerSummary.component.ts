import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Customer } from './customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'customer-summary',
    templateUrl: './customerSummary.component.html'
})
export class CustomerSummaryComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public customer: Customer | undefined = undefined;
    public isReady: boolean = false;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        let cartSubscription: Subscription = this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.customer = cart.customer;
                if (Object.getOwnPropertyNames(this.customer.billingAddress).length > 0) {
                    this.isReady = true;
                }
            }
        )
        this.subscriptions.push(cartSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }
}
