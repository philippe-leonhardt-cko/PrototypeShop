import { Component, Input } from '@angular/core';
import { ICheckoutSolutionComponent } from '../../cko-solution/cko-solution.interface';
import { CheckoutSummaryService } from '../../../services/checkoutsummary.service';
import { LogEntry } from '../../../classes/log-entry/log-entry';
import { Customer } from '../../../classes/customer/customer';

declare var Checkout: any;

@Component({
    selector: 'cko-js',
    templateUrl: './cko-js.component.html'
})

export class CheckoutJsComponent implements ICheckoutSolutionComponent {
    @Input() customer: Customer | undefined;
    @Input() checkoutSummaryService: CheckoutSummaryService | undefined;

    constructor() { }

    public init() { this.CheckoutConfigure() }
    public destroy() { }

    private CheckoutConfigure() {
        let checkoutSummaryService: CheckoutSummaryService = this.checkoutSummaryService!;
        let customer: Customer = this.customer!;
        let payButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#ckoPayButton');

        Checkout.configure({
            //debugMode: true,
            // START required
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            //paymentToken: this.paymentToken,
            customerEmail: customer.email,
            value: customer.order.subTotal,
            currency: customer.order.currency,
            cardFormMode: 'cardTokenisation',
            // END required
            renderMode: 3,
            paymentMode: 'cards',
            payButtonSelector: '#ckoPayButton',
            cardTokenised: function (event: any) {
                new LogEntry(checkoutSummaryService, event.data.cardToken)
            }
        });
        payButton.disabled = false;
    }
}