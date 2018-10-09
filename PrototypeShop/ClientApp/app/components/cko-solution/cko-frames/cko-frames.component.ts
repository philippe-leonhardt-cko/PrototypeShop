import { Component, Input, OnDestroy, AfterViewInit, Inject, NgZone } from '@angular/core';
import { ICheckoutSolutionComponent } from '../../cko-solution/cko-solution.interface';
import { CheckoutSummaryService } from '../../../services/checkoutsummary.service';
import { LogEntry } from '../../../classes/log-entry/log-entry';
import { Customer } from '../../../classes/customer/customer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PaymentToken } from '../../../classes/payment-token/PaymentToken';

declare var Frames: any;

@Component({
    selector: 'cko-frames',
    templateUrl: './cko-frames.component.html'
})

export class CheckoutFramesComponent implements ICheckoutSolutionComponent, AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    @Input() customer: Customer | undefined;
    @Input() checkoutSummaryService: CheckoutSummaryService | undefined;

    public customerAgreesWithGtc: boolean = false;

    constructor(private router: Router, private ngZone: NgZone) { }

    ngAfterViewInit() {
        let customerAgreesWithGtcSubscription: Subscription = (<CheckoutSummaryService>this.checkoutSummaryService).customerAgreesWithGtc$.subscribe(
            (customerAgreesWithGtc: boolean) => {
                this.customerAgreesWithGtc = customerAgreesWithGtc;
                if (this.customerAgreesWithGtc) {
                    this.CheckoutConfigure();
                }
            });
        this.subscriptions.push(customerAgreesWithGtcSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

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

        Frames.init({
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            containerSelector: '#ckoFramesContainer',
            customerName: this.customer!.fullName,
            billingDetails: {
                addressLine1: `${this.customer!.order.billingAddress.streetName} ${this.customer!.order.billingAddress.houseNumber}`,
                postcode: this.customer!.order.billingAddress.postcode,
                //country: this.customer.billingAddress.country,
                city: this.customer!.order.billingAddress.city
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
                cardTokenisedCallback(cardToken);
                Frames.addCardToken(paymentForm, cardToken);
                //paymentForm.submit();
            },
            cardTokenisationFailed: function (event: any) {
                new LogEntry(checkoutSummaryService!, event);
            }
        });
        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            Frames.submitCard();
        });
    }
}