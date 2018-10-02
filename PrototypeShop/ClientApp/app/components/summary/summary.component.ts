import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'summary',
    templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnDestroy {
    private subscriptions: Subscription[] = [];
    private customer: Customer;
    
    constructor(private checkoutSummaryService: CheckoutSummaryService) {
        this.makeSubscriptions()
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            }
        );
        this.subscriptions.push(customerSubscription);
    }
}
