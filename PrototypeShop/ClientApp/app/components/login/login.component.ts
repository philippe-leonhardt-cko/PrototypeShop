import { Component, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Customer } from '../../classes/customer/customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy{
    private subscriptions: Subscription[] = [];
    private customer: Customer;

    public loginForm: FormGroup;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private formBuilder: FormBuilder, private checkoutSummaryService: CheckoutSummaryService) {
        this.subscribeToCheckoutSummaryService();
        this.loginForm = formBuilder.group({
            'email': new FormControl(""/*, [Validators.required, Validators.email]*/),
            'password': new FormControl(""/*, Validators.required*/)
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private subscribeToCheckoutSummaryService() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        this.subscriptions.push(customerSubscription);
    }

    onSubmit() {
        this.http.post(this.baseUrl + 'api/Shop/Login/', this.loginForm.value).subscribe(
            (response: Response) => {
                let authenticationResponse = <IAuthenticationResponse>response.json();
                if (authenticationResponse.authorized) {
                    this.customer.logIn(<Customer>authenticationResponse.customer);
                } else {
                    console.warn('Login failed.');
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
