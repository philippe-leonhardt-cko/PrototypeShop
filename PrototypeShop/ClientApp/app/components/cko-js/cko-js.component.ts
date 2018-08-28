import { Component, OnDestroy } from '@angular/core';
import { DynamicScriptLoaderService } from '../../services/dynamicscriptloader.service';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';

declare var Checkout: any;

@Component({
    selector: 'cko-js',
    templateUrl: './cko-js.component.html',
    providers: [DynamicScriptLoaderService]
})

export class CheckoutJsComponent implements OnDestroy {
    private cart: Cart | undefined;
    private paymentToken: string | undefined;
    private subscriptions: Subscription[] = [];

    constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private checkoutSummaryService: CheckoutSummaryService) {
        this.loadResources();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private async loadResources() {
        let subscriptionsLoaded = await this.makeSubscriptions();
        console.log('Subscriptions loaded:', subscriptionsLoaded);
        let scriptsLoaded = await this.loadCheckoutScript();
        this.CheckoutConfigure();
        console.log('Scripts loaded:', scriptsLoaded);
    }

    private async loadCheckoutScript(): Promise<boolean> {
        let scripts = await this.dynamicScriptLoader.load('checkout.js');
        scripts.forEach(_ => {
            console.info(`Loaded external resource: ${_.script}`);
        });
        return scripts.every(script => script.loaded == true);
    }

    private async makeSubscriptions() {
        let cartSubscription = await this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.cart = cart;
            }
        );
        let paymentTokenSubscription = await this.checkoutSummaryService.paymentToken$.subscribe(
            paymentToken => {
                this.paymentToken = paymentToken;
            }
        );
        this.subscriptions.push(cartSubscription, paymentTokenSubscription);
    }

    private CheckoutConfigure() {
        let cart = this.cart as Cart;
        Checkout.configure({
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            paymentToken: this.paymentToken,
            value: cart.total,
            currency: cart.currency,
            customerEmail: cart.customer.email,
            cardFormMode: 'cardTokenisation',
            payButtonSelector: '#ckoJsPayBtn',
            cardTokenised: function (event: any) {
                console.log(event.data.cardToken);
            }
        });
    }
}