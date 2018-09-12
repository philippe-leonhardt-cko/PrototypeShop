import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { Cart } from '../cart/cart';
import { PaymentToken } from '../payment-token/PaymentToken';

@Component({
    selector: 'order',
    templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private cart: Cart;
    private paymentToken: string;
    private customerDetailsComplete: boolean;
    private customerAgreesWithGtc: boolean = false;

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
        let paymentTokenSubscription: Subscription = this.checkoutSummaryService.paymentToken$.subscribe(
            (paymentToken: PaymentToken) => {
                this.paymentToken = paymentToken.id;
                if (this.customerAgreesWithGtc) {
                    this.customerAgreesWithGtc = false;
                }
            }
        );
        let customerDetailsCompleteSubscription: Subscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            }
        );
        this.subscriptions.push(cartSubscription, paymentTokenSubscription, customerDetailsCompleteSubscription);
    }

    private configureCheckout(customerAgreesWithGtc: boolean) {
        this.customerAgreesWithGtc = customerAgreesWithGtc;
    }
}
