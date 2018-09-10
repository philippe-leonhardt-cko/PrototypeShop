import { Component, OnDestroy } from '@angular/core';
import { DynamicScriptLoaderService } from '../../services/dynamicscriptloader.service';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';
import { PaymentToken } from '../payment-token/PaymentToken';

declare var Frames: any;

@Component({
    selector: 'cko-frames',
    templateUrl: './cko-frames.component.html',
    providers: [DynamicScriptLoaderService]
})

export class CheckoutFramesComponent implements OnDestroy {
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
        let scripts = await this.dynamicScriptLoader.load('frames');
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
        let paymentForm = document.querySelector('#ckoFramesPaymentForm') as HTMLFormElement;
        let payNowButton = document.querySelector('#ckoFramesPayNowButton') as HTMLButtonElement;

        let style = {
            'iframe.cko-iframe:not(.mobile)': {
                position: 'relative'
            }
        }

        Frames.init({
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            containerSelector: '#ckoFramesContainer',
            style: style,
            customerName: this.cart.customer.fullName,
            billingDetails: {
                addressLine1: `${this.cart.customer.billingAddress.streetName} ${this.cart.customer.billingAddress.houseNumber}`,
                postcode: this.cart.customer.billingAddress.postcode,
                //country: this.cart.customer.billingAddress.country,
                city: this.cart.customer.billingAddress.city
            },
            cardValidationChanged: function () {
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