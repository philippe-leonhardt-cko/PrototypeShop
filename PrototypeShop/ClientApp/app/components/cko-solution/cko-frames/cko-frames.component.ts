import { Component, Input, NgZone } from '@angular/core';
import { ICheckoutSolutionComponent } from '../../cko-solution/cko-solution.interface';
import { CheckoutSummaryService } from '../../../services/checkoutsummary.service';
import { LogEntry } from '../../../classes/log-entry/log-entry';
import { Customer } from '../../../classes/customer/customer';
import { Router } from '@angular/router';
import { PaymentToken } from '../../../classes/payment-token/PaymentToken';
import { BaseAddress } from '../../../classes/address/BaseAddress';

declare var Frames: any;

@Component({
    selector: 'cko-frames',
    templateUrl: './cko-frames.component.html'
})

export class CheckoutFramesComponent implements ICheckoutSolutionComponent {
    @Input() customer: Customer | undefined;
    @Input() checkoutSummaryService: CheckoutSummaryService | undefined;

    public customerAgreesWithGtc: boolean = false;

    constructor(private router: Router, private ngZone: NgZone) { }

    public init() { this.CheckoutConfigure(); }

    public destroy() { }

    private CheckoutConfigure() {
        let checkoutSummaryService: CheckoutSummaryService | undefined = this.checkoutSummaryService;
        let paymentForm: HTMLFormElement = <HTMLFormElement>document.querySelector('#ckoPaymentForm');
        let payButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#ckoPayButton');
        const cardTokenisedCallback = async (cardTokenOld: string) => {
            new LogEntry(checkoutSummaryService!, `Old API returned Card Token ${cardTokenOld}`);
            let cardToken: PaymentToken = await this.customer!.order.requestCardToken();
            let orderId: string = await this.customer!.order.chargeWithCardToken(cardToken.id);
            this.ngZone.run(() => this.router.navigateByUrl(`/order/${orderId}`));
        }
        const baseAddress = async (address: BaseAddress): Promise<BaseAddress> => {
            console.log(address.country);
            return await address;
        }

        Frames.init({
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            containerSelector: '#ckoFramesContainer',
            customerName: this.customer!.order.billingAddress.addressLine1,
            billingDetails: baseAddress(this.customer!.order.billingAddress),
            cardValidationChanged: function () {
                payButton.disabled = !Frames.isCardValid();
            },
            cardSubmitted: function () {
                payButton.disabled = true;
                // display loader
            },
            cardTokenised: function (event: any) {
                let cardToken: string = event.data.cardToken;
                cardTokenisedCallback(cardToken);
                Frames.addCardToken(paymentForm, cardToken);
                //paymentForm.submit();
            },
            cardTokenisationFailed: function (event: any) {
                new LogEntry(checkoutSummaryService!, event);
            }
        });
        payButton.addEventListener('click', function (event) {
            event.preventDefault();
            Frames.submitCard();
        });
    }
}