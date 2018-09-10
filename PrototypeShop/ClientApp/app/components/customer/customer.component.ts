import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from './customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BillingAddress } from '../address/BillingAddress';
import { ShippingAddress } from '../address/ShippingAddress';
import { BaseAddress } from '../address/BaseAddress';

@Component({
    selector: 'customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public customer: Customer;
    public billingForm: FormGroup;
    public shippingForm: FormGroup;

    public email = new FormControl("", Validators.required);
    public firstName = new FormControl("", Validators.required);
    public lastName = new FormControl("", Validators.required);
    public companyName = new FormControl("");
    public streetName = new FormControl("", Validators.required);
    public houseNumber = new FormControl("", Validators.required);
    public postcode = new FormControl("", Validators.required);
    public city = new FormControl("", Validators.required);
    public country = new FormControl("", Validators.required);

    public shippingFirstName = new FormControl("", Validators.required);
    public shippingLastName = new FormControl("", Validators.required);
    public shippingCompanyName = new FormControl("");
    public shippingStreetName = new FormControl("", Validators.required);
    public shippingHouseNumber = new FormControl("", Validators.required);
    public shippingPostcode = new FormControl("", Validators.required);
    public shippingCity = new FormControl("", Validators.required);
    public shippingCountry = new FormControl("", Validators.required);

    constructor(private checkoutSummaryService: CheckoutSummaryService, private formBuilder: FormBuilder) {
        this.billingForm = this.formBuilder.group({
            "email": this.email,
            "address": this.formBuilder.group({
                "firstName": this.firstName,
                "lastName": this.lastName,
                "companyName": this.companyName,
                "streetName": this.streetName,
                "houseNumber": this.houseNumber,
                "postcode": this.postcode,
                "city": this.city,
                "country": this.country                                                                        
            })            
        });
        this.shippingForm = this.formBuilder.group({
            "address": this.formBuilder.group({
                "firstName": this.shippingFirstName,
                "lastName": this.shippingLastName,
                "companyName": this.shippingCompanyName,
                "streetName": this.shippingStreetName,
                "houseNumber": this.shippingHouseNumber,
                "postcode": this.shippingPostcode,
                "city": this.shippingCity,
                "country": this.shippingCountry
            })
        });
    }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }

    private makeSubscriptions() {
        let cartSubscription: Subscription = this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.customer = cart.customer;
                this.fillForms();
            }
        );
        let billingFormSubscription: Subscription = this.billingForm.valueChanges
            //.filter((values) => this.billingForm.valid)
            .map(
            (formValues: IFormValues) => {
                let streetValue = formValues.address.streetName;
                let regExp = new RegExp('([a-zäöüßéúíóáýèùìòà. -]{1,}[0-9]{0,}[a-zäöüßéúíóáýèùìòà. -]{1,}) ([0-9 ]{1,}[-+/\\a-z0-9 ]{0,})');
                let matches = regExp.exec(streetValue!);
                if (matches) {
                    console.log(matches[1], matches[2]);
                }
                return formValues;
            })
            .subscribe(
            (formValues: IFormValues) => {
                this.customer.email = formValues.email;
                let address = this.customer.billingAddress as BillingAddress;
                address.firstName = formValues.address.firstName;
                address.lastName = formValues.address.lastName;
                address.companyName = formValues.address.companyName;
                address.streetName = formValues.address.streetName;
                address.houseNumber = formValues.address.houseNumber;
                address.postcode = formValues.address.postcode;
                address.city = formValues.address.city;
                address.country = formValues.address.country;
                this.formsCompleted();
            });
        let shippingFormSubscription: Subscription = this.shippingForm.valueChanges
            //.filter((values) => this.shippingForm.valid)
            .subscribe(
            (formValues: IFormValues) => {
                let address = this.customer.shippingAddress as ShippingAddress;
                address.firstName = formValues.address.firstName;
                address.lastName = formValues.address.lastName;
                address.companyName = formValues.address.companyName;
                address.streetName = formValues.address.streetName;
                address.houseNumber = formValues.address.houseNumber;
                address.postcode = formValues.address.postcode;
                address.city = formValues.address.city;
                address.country = formValues.address.country;
                this.formsCompleted();
            });
        this.subscriptions.push(cartSubscription, billingFormSubscription, shippingFormSubscription);
    }

    private fillForms() {
        this.billingForm.patchValue({ email: this.customer.email });
        this.billingForm.patchValue({ address: this.customer.billingAddress });
        this.shippingForm.patchValue({ address: this.customer.shippingAddress });
    }

    private formsCompleted() {
        let allFormsCompleted: boolean = false;
        if (this.customer.shippingToBillingAddress) {
            allFormsCompleted = this.billingForm.valid;
        } else {
            allFormsCompleted = (this.billingForm.valid && this.shippingForm.valid);
        }
        this.checkoutSummaryService.updateCustomerDetailsComplete(allFormsCompleted);
    }

}

interface IFormValues {
    email?: string;
    address: BaseAddress;
}
