import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from './customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { Cart } from '../cart/cart';

@Component({
    selector: 'customer-summary',
    templateUrl: './customerSummary.component.html'
})
export class CustomerSummaryComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    private customer: Customer | undefined = undefined;
    private isReady: boolean = false;
    private customerDetailsComplete: boolean;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }

    private makeSubscriptions() {
        let cartSubscription: Subscription = this.checkoutSummaryService.cart$.subscribe(
            (cart: Cart) => {
                this.customer = cart.customer;
                if (Object.getOwnPropertyNames(this.customer.billingAddress).length > 0) {
                    this.isReady = true;
                }
            }
        );
        let customerDetailsCompleteSubscription: Subscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            }
        );
        this.subscriptions.push(cartSubscription, customerDetailsCompleteSubscription);
    }
}
