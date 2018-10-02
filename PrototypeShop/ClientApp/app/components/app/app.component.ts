import { Component, Inject, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { PaymentToken } from '../../classes/payment-token/PaymentToken';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    providers: [CheckoutSummaryService]
})
export class AppComponent implements OnDestroy {
    private solutions: string[] = [
        'Frames',
        'Checkout.js'
    ];
    private cartIsVisible: boolean = false;

    private subscriptions: Subscription[] = [];
    private log: any[] = [];
    private customer: Customer;
    private paymentTokenId: string | undefined = undefined;
    private paymentTokenCountdown: number = 0;
    private customerDetailsComplete: boolean = false;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.customer = new Customer(this.http, this.baseUrl, this.checkoutSummaryService);
        this.checkoutSummaryService.setCustomer(this.customer);
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscripion => subscripion.unsubscribe());
    }

    private makeSubscriptions() {
        let logSubscription: Subscription = this.checkoutSummaryService.log$.subscribe(
            (log: any) => {
                this.log.push(log);
            });
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        let paymentTokenSubscription: Subscription = this.checkoutSummaryService.paymentToken$.subscribe(
            (paymentToken: PaymentToken) => {
                this.paymentTokenId = paymentToken.id;
            });
        let paymentTokenCountdownSubscription: Subscription = this.checkoutSummaryService.paymentTokenCountdown$.subscribe(
            (paymentTokenCountdown: number) => {
                this.paymentTokenCountdown = paymentTokenCountdown;
            });
        let customerDetailsCompleteSubscription: Subscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            });
        this.subscriptions.push(logSubscription, customerSubscription, paymentTokenSubscription, paymentTokenCountdownSubscription, customerDetailsCompleteSubscription);
    }

    private toggleCart() {
        this.cartIsVisible = !this.cartIsVisible;
    }
}
