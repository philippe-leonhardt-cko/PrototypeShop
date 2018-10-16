import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Customer } from '../../classes/customer/customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { BaseAddress } from '../../classes/address/BaseAddress';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy{
    private subscriptions: Subscription[] = [];
    private customer: Customer;

    public loginForm: FormGroup;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private formBuilder: FormBuilder, private checkoutSummaryService: CheckoutSummaryService) {
        this.loginForm = formBuilder.group({
            'email': new FormControl(""/*, [Validators.required, Validators.email]*/),
            'password': new FormControl(""/*, Validators.required*/)
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
        this.subscriptions.push(customerSubscription);
    }

    onSubmit() {
        this.http.post(this.baseUrl + 'api/Shop/Login/', this.loginForm.value).subscribe(
            (response: Response) => {
                let authenticationResponse = response.json() as IAuthenticationResponse;
                if (authenticationResponse.authorized) {
                    this.customer.logIn();
                    let customerData = (<Customer>authenticationResponse.customer);
                    this.customer.email = customerData.email;
                    this.customer.addresses = customerData.addresses.sort(
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
                    let primaryBillingAddress = <BaseAddress>customerData.addresses.find((address: BaseAddress) => <boolean>address.isPrimaryBillingAddress);
                    this.customer.order.billingAddress = primaryBillingAddress;
                    let primaryShippingAddress = <BaseAddress>customerData.addresses.find((address: BaseAddress) => <boolean>address.isPrimaryShippingAddress);
                    this.customer.order.shippingAddress = primaryShippingAddress;
                    this.customer.firstName = customerData.firstName;
                    this.customer.lastName = customerData.lastName;
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
