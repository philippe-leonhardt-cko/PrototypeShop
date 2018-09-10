import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';


@Component({
    selector: 'cart-summary',
    templateUrl: './cartSummary.component.html'
})

export class CartSummaryComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private cart: Cart | undefined;

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
            }
        );
        this.subscriptions.push(cartSubscription);
    }
}