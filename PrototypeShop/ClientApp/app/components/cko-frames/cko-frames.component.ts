import { Component, Input } from '@angular/core';
import { DynamicScriptLoaderService } from '../../services/dynamicscriptloader.service';
import { Cart } from '../cart/cart';
import { ICheckoutSolutionComponent } from '../cko-solution/cko-solution.interface';

declare var Frames: any;

@Component({
    selector: 'cko-frames',
    templateUrl: './cko-frames.component.html',
    providers: [DynamicScriptLoaderService]
})

export class CheckoutFramesComponent implements ICheckoutSolutionComponent {
    @Input() cart: Cart;
    @Input() paymentToken: string;
    @Input() customerDetailsComplete: boolean = false;

    constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {
        this.loadResources();
    }

    private async loadResources() {
        console.groupCollapsed('Load Resources');
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

    private configureIfReady() {
        if (this.cart.total > 0 && this.paymentToken && this.customerDetailsComplete) {
            this.CheckoutConfigure();
        }
    }

    private CheckoutConfigure() {
        let paymentForm = document.querySelector('#ckoPaymentForm') as HTMLFormElement;
        let payButton = document.querySelector('#ckoPayButton') as HTMLButtonElement;

        let style = {
            'iframe.cko-iframe:not(.mobile)': {
                position: 'relative !important'
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
                payButton.disabled = !Frames.isCardValid();
            },
            cardSubmitted: function () {
                payButton.disabled = true;
                // display loader
            },
            cardTokenised: function (event: any) {
                let cardToken: string = event.data.cardToken;
                console.log(cardToken);
                Frames.addCardToken(paymentForm, cardToken);
                //paymentForm.submit();
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