import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Customer } from '../../classes/customer/customer';
import { Subscription } from 'rxjs';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';


@Component({
    selector: 'cart',
    templateUrl: './cart.component.html'
})

export class CartComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private customer: Customer | undefined;
    private customerDetailsComplete: boolean = false;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        let customerDetailsCompleteSubscription: Subscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            });
        this.subscriptions.push(customerSubscription, customerDetailsCompleteSubscription);
    }

    private keyPress(event: KeyboardEvent) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}