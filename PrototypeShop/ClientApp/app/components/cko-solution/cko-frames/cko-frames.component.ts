import { Component, Input, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { ICheckoutSolutionComponent } from '../../cko-solution/cko-solution.interface';
import { CheckoutSummaryService } from '../../../services/checkoutsummary.service';
import { LogEntry } from '../../../classes/log-entry/log-entry';
import { Customer } from '../../../classes/customer/customer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

declare var Frames: any;

@Component({
    selector: 'cko-frames',
    templateUrl: './cko-frames.component.html'
})

export class CheckoutFramesComponent implements ICheckoutSolutionComponent, AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    @Input() customer: Customer;
    @Input() paymentToken: string;
    @Input() checkoutSummaryService: CheckoutSummaryService;

    public customerAgreesWithGtc: boolean;

    constructor(private router: Router) { }

    ngAfterViewInit() {
        let customerAgreesWithGtcSubscription: Subscription = this.checkoutSummaryService.customerAgreesWithGtc$.subscribe(
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
        let checkoutSummaryService: CheckoutSummaryService = this.checkoutSummaryService;
        let paymentForm: HTMLFormElement = <HTMLFormElement>document.querySelector('#ckoPaymentForm');
        let payButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#ckoPayButton');
        let paymentToken = this.paymentToken;
        const cardTokenisedCallback = (cardToken: string) => {
            new LogEntry(checkoutSummaryService, `Card Token ${cardToken} returned from Payment Gateway`);
            this.customer.cart.chargeWithCardToken(cardToken);
            this.router.navigate(['', { outlets: { primary: ['order', paymentToken], contextMenu: null } }]);
        }

        Frames.init({
            publicKey: 'pk_test_3f148aa9-347a-450d-b940-0a8645b324e7',
            containerSelector: '#ckoFramesContainer',
            customerName: this.customer.fullName,
            billingDetails: {
                addressLine1: `${this.customer.billingAddress.streetName} ${this.customer.billingAddress.houseNumber}`,
                postcode: this.customer.billingAddress.postcode,
                //country: this.customer.billingAddress.country,
                city: this.customer.billingAddress.city
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
                //Frames.addCardToken(paymentForm, cardToken);
                //paymentForm.submit();
            },
            cardTokenisationFailed: function (event: any) {
                new LogEntry(checkoutSummaryService, event);
            }
        });
        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            Frames.submitCard();
        });
    }
}