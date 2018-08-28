import { Component, OnDestroy } from '@angular/core';
import { DynamicScriptLoaderService } from '../../services/dynamicscriptloader.service';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';

declare var Frames: any;

@Component({
    selector: 'cko-frames',
    templateUrl: './cko-frames.component.html',
    providers: [DynamicScriptLoaderService]
})

export class CheckoutFramesComponent implements OnDestroy {
    private cart: Cart;
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
        let scripts = await this.dynamicScriptLoader.load('frames');
        scripts.forEach(_ => {
            console.info(`Loaded external resource: ${_.script}`);
        });
        return scripts.every(script => script.loaded == true);
    }

    private async makeSubscriptions() {
        let subscriptionsLoaded: boolean[] = [];
        let cartSubscription = await this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.cart = cart;
                subscriptionsLoaded.push(true);
            }
        );
        let paymentTokenSubscription = await this.checkoutSummaryService.paymentToken$.subscribe(
            paymentToken => {
                this.paymentToken = paymentToken;
                subscriptionsLoaded.push(true);
            }
        );
        this.subscriptions.push(cartSubscription, paymentTokenSubscription);
        return subscriptionsLoaded.every(status => status == true);
    }

    private CheckoutConfigure() {
        let paymentForm = document.querySelector('#payment-form') as HTMLFormElement;
        let payNowButton = document.querySelector('#pay-now-button') as HTMLButtonElement;

        Frames.init({
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            containerSelector: '.frames-container',
            customerName: this.cart.customer.fullName,
            billingDetails: {
                addressLine1: `${this.cart.customer.billingAddress.streetName} ${this.cart.customer.billingAddress.houseNumber}`,
                postcode: this.cart.customer.billingAddress.zip,
                //country: this.cart.customer.billingAddress.country,
                city: this.cart.customer.billingAddress.city
            },
            cardValidationChanged: function () {
                // if all fields contain valid information, the Pay now
                // button will be enabled and the form can be submitted
                payNowButton.disabled = !Frames.isCardValid();
            },
            cardSubmitted: function () {
                payNowButton.disabled = true;
                // display loader
            },
            cardTokenised: function (event: any) {
                let cardToken: string = event.data.cardToken;
                console.log(cardToken);
                /*Frames.addCardToken(paymentForm, data.cardToken);
                paymentForm.submit();*/
            },
            cardTokenisationFailed: function (event: any) {
                console.log(event);
            }
        });
        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            Frames.submitCard();
        });
    }
}