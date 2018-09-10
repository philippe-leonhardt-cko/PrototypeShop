import { Component, OnDestroy } from '@angular/core';
import { DynamicScriptLoaderService } from '../../services/dynamicscriptloader.service';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';
import { PaymentToken } from '../payment-token/PaymentToken';

declare var Checkout: any;

@Component({
    selector: 'cko-js',
    templateUrl: './cko-js.component.html',
    providers: [DynamicScriptLoaderService]
})

export class CheckoutJsComponent implements OnDestroy {
    private subscriptions: Subscription[] = [];
    private cart: Cart;
    private paymentToken: string;
    private customerDetailsComplete: boolean = false;
    private checkoutIsReady: boolean = false;

    constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private checkoutSummaryService: CheckoutSummaryService) {
        this.loadResources();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private async loadResources() {
        console.groupCollapsed('Load Resources');
        let subscriptionsLoaded = await this.makeSubscriptions();
        console.assert(subscriptionsLoaded, 'Not all Subscriptions have loaded!');
        let scriptsLoaded = await this.loadCheckoutScript();
        console.assert(scriptsLoaded, 'Not all Scripts have loaded!');
        console.groupEnd();
        this.configureIfReady();
    }

    private async loadCheckoutScript(): Promise<boolean> {
        let scripts = await this.dynamicScriptLoader.load('checkout.js');
        scripts.forEach(_ => {
            if (_.loaded) {
                console.info(`Loaded external script: '${_.script}' successfully.`);
            } else {
                console.error(`Did not load external script: '${_.script}' successfully.`);
            }
        });
        return scripts.every(script => script.loaded == true);
    }

    private async makeSubscriptions(): Promise<boolean> {
        let subscriptionsLoaded: boolean[] = [];
        let cartSubscription = await this.checkoutSummaryService.cart$.subscribe(
            (cart: Cart) => {
                this.cart = cart;
                subscriptionsLoaded.push(true);
            }
        );
        let paymentTokenSubscription = await this.checkoutSummaryService.paymentToken$.subscribe(
            (paymentToken: PaymentToken) => {
                this.paymentToken = paymentToken.id;
                subscriptionsLoaded.push(true);
            }
        );
        let customerDetailsCompletedSubscription = await this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
                subscriptionsLoaded.push(true);
            }
        );
        this.subscriptions.push(cartSubscription, paymentTokenSubscription, customerDetailsCompletedSubscription);
        return subscriptionsLoaded.every(status => status == true);
    }

    private configureIfReady() {
        if (this.cart.total > 0 && this.paymentToken && this.customerDetailsComplete) {
            this.CheckoutConfigure();
        }
    }

    private CheckoutConfigure() {
        let cart = this.cart as Cart;
        Checkout.configure({
            //debugMode: true,
            // START required
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            paymentToken: this.paymentToken,
            customerEmail: cart.customer.email,
            value: cart.total,
            currency: cart.currency,
            cardFormMode: 'cardTokenisation',
            // END required
            renderMode: 3,
            payButtonSelector: '#ckoJsPayButton',
            cardTokenised: function (event: any) {
                console.log(event.data.cardToken);
            }
        });
        this.checkoutIsReady = true;
    }
}