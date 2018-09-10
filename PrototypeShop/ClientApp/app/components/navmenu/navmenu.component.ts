import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { Cart } from '../cart/cart';
import { PaymentToken } from '../payment-token/PaymentToken';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    private solutions: string[] = [
        'Frames',
        'Checkout.js'
    ];
    private currentSolution: string = this.solutions[0];

    private cart: Cart | undefined = undefined;
    private paymentTokenId: string | undefined = undefined;
    private paymentTokenCountdown: number = 0;
    private sidebarCartVisible: boolean = true;
    private customerDetailsComplete: boolean = false;
    private debugConsoleVisible: boolean = false;

    constructor(private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private toggleSidebarCartVisibility(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.sidebarCartVisible = !this.sidebarCartVisible;
    }

    private toggleDebugConsoleVisibility() {
        this.debugConsoleVisible = !this.debugConsoleVisible;
    }

    private makeSubscriptions() {
        let cartSubscription = this.checkoutSummaryService.cart$.subscribe(
            (cart: any) => {
                this.cart = cart;
            }
        );
        let customerDetailsCompleteSubscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            }
        );
        let paymentTokenSubscription = this.checkoutSummaryService.paymentToken$.subscribe(
            (paymentToken: PaymentToken) => {
                this.paymentTokenId = paymentToken.id;
                paymentToken.countdown.add(
                    (_: any) => {
                        this.paymentTokenId = undefined;
                    }
                );
            }
        );
        let paymentTokenCountdownSubscription = this.checkoutSummaryService.paymentTokenCountdown$.subscribe(
            (paymentTokenCountdown: number) => {
                this.paymentTokenCountdown = paymentTokenCountdown;
            }
        );
        this.subscriptions.push(cartSubscription, customerDetailsCompleteSubscription, paymentTokenSubscription, paymentTokenCountdownSubscription);
    }

    private setSolution(event: Event) {
        let target = event.currentTarget as HTMLElement;
        this.currentSolution = target.id;
    }
}
