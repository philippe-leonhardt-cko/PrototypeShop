import { Component, Input } from '@angular/core';
import { Cart } from '../../cart/cart';
import { ICheckoutSolutionComponent } from '../../cko-solution/cko-solution.interface';

declare var Checkout: any;

@Component({
    selector: 'cko-js',
    templateUrl: './cko-js.component.html'
})

export class CheckoutJsComponent implements ICheckoutSolutionComponent {
    @Input() cart: Cart;
    @Input() paymentToken: string;
    private _customerAgreesWithGtc: boolean;
    @Input()
    set customerAgreesWithGtc(decision: boolean) {
        this._customerAgreesWithGtc = decision;
        if (decision) {
            this.CheckoutConfigure();
        }
    }
    get customerAgreesWithGtc(): boolean {
        return this._customerAgreesWithGtc;
    }

    constructor() { }

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