import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { Cart } from '../cart/cart';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    private cart: Cart | undefined = undefined;
    private customerPageUnlocked: boolean = false;
    private orderPageUnlocked: boolean = false;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let cartSubscription = this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.cart = cart;
            }
        );
        let customerPageUnlockedSubscription = this.checkoutSummaryService.customerPageUnlocked$.subscribe(
            customerPageUnlocked => {
                this.customerPageUnlocked = customerPageUnlocked;
            }
        );
        let orderPageUnlockedSubscription = this.checkoutSummaryService.orderPageUnlocked$.subscribe(
            orderPageUnlocked => {
                this.orderPageUnlocked = orderPageUnlocked;
            }
        );
        this.subscriptions.push(cartSubscription, customerPageUnlockedSubscription, orderPageUnlockedSubscription);
    }
}
