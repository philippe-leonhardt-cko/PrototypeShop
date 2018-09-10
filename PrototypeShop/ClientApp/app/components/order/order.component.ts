import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { Cart } from '../cart/cart';

@Component({
    selector: 'order',
    templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private cart: Cart;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let cartSubscription: Subscription = this.checkoutSummaryService.cart$.subscribe(
            (cart: Cart) => {
                this.cart = cart;
            });
        this.subscriptions.push(cartSubscription);
    }
}
