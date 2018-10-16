import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, Timestamp } from 'rxjs';
import { PaymentToken } from '../classes/payment-token/PaymentToken';
import { LogEntry } from '../classes/log-entry/log-entry';
import { Customer } from '../classes/customer/customer';

@Injectable()
export class CheckoutSummaryService {
    // Subjects
    private logSource = new ReplaySubject<any>();
    private customerSource = new ReplaySubject<Customer>();
    private shippingToBillingAddressSource = new ReplaySubject<boolean>();
    private paymentTokenSource = new ReplaySubject<PaymentToken>();
    private checkoutSolutionSource = new ReplaySubject<string>();
    private paymentTokenCountdownSource = new Subject<number>();
    private customerDetailsCompleteSource = new ReplaySubject<boolean>();
    private customerAgreesWithGtcSource = new ReplaySubject<boolean>();
    private sideBarSource = new ReplaySubject<boolean>();

    // Observables
    public log$ = this.logSource.asObservable();
    public customer$ = this.customerSource.asObservable();
    public shippingToBillingAddress$ = this.shippingToBillingAddressSource.asObservable();
    public paymentToken$ = this.paymentTokenSource.asObservable();
    public checkoutSolutionSource$ = this.checkoutSolutionSource.asObservable();
    public paymentTokenCountdown$ = this.paymentTokenCountdownSource.asObservable();
    public customerDetailsComplete$ = this.customerDetailsCompleteSource.asObservable();
    public customerAgreesWithGtc$ = this.customerAgreesWithGtcSource.asObservable();
    public sideBar$ = this.sideBarSource.asObservable();

    // Methods
    public log(timestamp: Timestamp<any>, message: string) {
        this.logSource.next({ 't': timestamp, 'm': message });
    }
    public setCustomer(customer: Customer) {
        this.customerSource.next(customer);
        new LogEntry(this, `New Customer created`);
    }
    public updateShippingToBillingAddress(isDesired: boolean) {
        this.shippingToBillingAddressSource.next(isDesired);
    }
    public updatePaymentToken(paymentToken: PaymentToken) {
        this.paymentTokenSource.next(paymentToken);
    }
    public updateCheckoutSolution(checkoutSolution: string) {
        this.checkoutSolutionSource.next(checkoutSolution);
    }
    public updatePaymentTokenCountdown(paymentTokenCountdown: number) {
        this.paymentTokenCountdownSource.next(paymentTokenCountdown);
    }
    public updateCustomerDetailsComplete(areComplete: boolean) {
        this.customerDetailsCompleteSource.next(areComplete);
    }
    public updateCustomerAgreesWithGtc(consentGiven: boolean) {
        this.customerAgreesWithGtcSource.next(consentGiven);
    }
    public toggleSideBar(isOpen: boolean) {
        this.sideBarSource.next(isOpen);
    }
}