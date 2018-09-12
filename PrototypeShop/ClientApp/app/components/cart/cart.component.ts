import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
    selector: 'cart',
    templateUrl: './cart.component.html'
})

export class CartComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private cart: Cart | undefined;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private router: Router) { }

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

    private keyPress(event: KeyboardEvent) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}