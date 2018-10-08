import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Customer } from '../../classes/customer/customer';
import { BillingAddress } from '../../classes/address/BillingAddress';
import { ShippingAddress } from '../../classes/address/ShippingAddress';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy{
    private subscriptions: Subscription[] = [];
    private customer: Customer | undefined;
    private customerDetailsComplete: boolean = false;

    public loginForm: FormGroup;
    public email = new FormControl(""/*, [Validators.required, Validators.email]*/);
    public password = new FormControl(""/*, Validators.required*/);

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private formBuilder: FormBuilder, private checkoutSummaryService: CheckoutSummaryService) {
        this.loginForm = formBuilder.group({
            'email': this.email,
            'password': this.password
        });
    }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        let customerDetailsCompleteSubscription: Subscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            });
        this.subscriptions.push(customerSubscription, customerDetailsCompleteSubscription);
    }

    private previous(addressElement: HTMLDivElement, addresses: NodeListOf<HTMLDivElement>): HTMLDivElement {
        let previousAddressElement: HTMLDivElement;
        if (addressElement.previousElementSibling) {
            previousAddressElement = <HTMLDivElement>addressElement.previousElementSibling;
        } else {
            previousAddressElement = <HTMLDivElement>addresses.item(addresses.length - 1);
        }
        return previousAddressElement;
    }

    private next(addressElement: HTMLDivElement, addresses: NodeListOf<HTMLDivElement>): HTMLDivElement {
        let nextAddressElement: HTMLDivElement;
        if (addressElement.nextElementSibling) {
            nextAddressElement = <HTMLDivElement>addressElement.nextElementSibling;
        } else {
            nextAddressElement = <HTMLDivElement>addresses.item(0);
        }
        return nextAddressElement;
    }

    private showPreviousAddress(addressesFrame: HTMLDivElement) {
        this.slideAddresses(addressesFrame, 'previous');
    }

    private showNextAddress(addressesFrame: HTMLDivElement) {
        this.slideAddresses(addressesFrame, 'next');
    }

    private slideAddresses(addressesFrame: HTMLDivElement, direction: string) {
        let addresses = <NodeListOf<HTMLDivElement>>addressesFrame.querySelectorAll('.address');
        let currentAddressElement: HTMLDivElement = <HTMLDivElement>addressesFrame.querySelector('.is-ref');
        currentAddressElement.classList.remove('is-ref');

        let newAddressElement: HTMLDivElement;
        switch (direction) {
            case 'previous': {
                newAddressElement = this.previous(currentAddressElement, addresses);
                addressesFrame.classList.add('is-reversing');
                break;
            }
            case 'next': {
                newAddressElement = this.next(currentAddressElement, addresses);
                addressesFrame.classList.remove('is-reversing');
                break;
            }
            default: {
                newAddressElement = this.next(currentAddressElement, addresses);
                break;
            }
        }
        newAddressElement.classList.add('is-ref');
        newAddressElement.style.order = '1';
        let range = Array.from({ length: addresses.length - 1 }, (v, k) => k + 2);
        range.forEach(
            (i: number) => {
                newAddressElement = this.next(newAddressElement, addresses);
                newAddressElement.style.order = i.toString();
            });
        
        addressesFrame.classList.remove('is-set');
        setTimeout(() => addressesFrame.classList.add('is-set'), 50);
    }

    onSubmit() {
        this.http.post(this.baseUrl + 'api/Shop/Login/', this.loginForm.value).subscribe(
            (response: Response) => {
                let authenticationResponse = response.json() as IAuthenticationResponse;
                if (authenticationResponse.authorized) {
                    this.customer!.logIn();
                    let customerData = (<Customer>authenticationResponse.customer);
                    this.customer!.email = customerData.email;
                    this.customer!.addresses = customerData.addresses.sort(
                        (a, b) => {
                            let nameA = a.firstName!.toUpperCase();
                            let nameB = b.firstName!.toUpperCase();
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    let primaryBillingAddress = <BillingAddress>customerData.addresses.find((address: BillingAddress) => <boolean>address.isPrimaryBillingAddress);
                    this.customer!.billingAddress = primaryBillingAddress;
                    let primaryShippingAddress = <ShippingAddress>customerData.addresses.find((address: ShippingAddress) => <boolean>address.isPrimaryShippingAddress);
                    this.customer!.shippingAddress = primaryShippingAddress;
                }
            },
            (error: any) => console.error(error)
        );
    }
}

export interface IAuthenticationResponse {
    authorized: boolean;
    customer: Customer | null;
}
