import { Component, Input } from '@angular/core';
import { DynamicScriptLoaderService } from '../../services/dynamicscriptloader.service';
import { Cart } from '../cart/cart';
import { ICheckoutSolutionComponent } from '../cko-solution/cko-solution.interface';

declare var Checkout: any;

@Component({
    selector: 'cko-js',
    templateUrl: './cko-js.component.html',
    providers: [DynamicScriptLoaderService]
})

export class CheckoutJsComponent implements ICheckoutSolutionComponent {
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

    private configureIfReady() {
        if (this.cart.total > 0 && this.paymentToken && this.customerDetailsComplete) {
            this.CheckoutConfigure();
        }
    }

    private CheckoutConfigure() {
        let cart = this.cart as Cart;
        let payButton = document.querySelector('#ckoPayButton') as HTMLButtonElement;

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
            paymentMode: 'cards',
            payButtonSelector: '#ckoPayButton',
            cardTokenised: function (event: any) {
                console.log(event.data.cardToken);
            }
        });
        payButton.disabled = false;
    }
}