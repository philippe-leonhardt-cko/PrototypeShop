import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from './customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BillingAddress } from '../address/BillingAddress';
import { ShippingAddress } from '../address/ShippingAddress';

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
    public zip = new FormControl("", Validators.required);
    public city = new FormControl("", Validators.required);
    public country = new FormControl("", Validators.required);

    public shippingFirstName = new FormControl("", Validators.required);
    public shippingLastName = new FormControl("", Validators.required);
    public shippingCompanyName = new FormControl("");
    public shippingStreetName = new FormControl("", Validators.required);
    public shippingHouseNumber = new FormControl("", Validators.required);
    public shippingZip = new FormControl("", Validators.required);
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
                "zip": this.zip,
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
                "zip": this.shippingZip,
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
            .filter((values) => this.billingForm.valid)
            .subscribe(
            (values) => {
                console.log('Billing Form valid:', this.billingForm.valid);
                this.customer.email = values.email;
                let billingAddress = this.customer.billingAddress as BillingAddress;
                billingAddress.firstName = values.address.firstName;
                billingAddress.lastName = values.address.lastName;
                billingAddress.companyName = values.address.companyName;
                billingAddress.streetName = values.address.streetName;
                billingAddress.houseNumber = values.address.houseNumber;
                billingAddress.zip = values.address.zip;
                billingAddress.city = values.address.city;
                billingAddress.country = values.address.country;
            });
        let shippingFormSubscription: Subscription = this.shippingForm.valueChanges
            .filter((values) => this.shippingForm.valid)
            .subscribe(
            (values) => {
                let shippingAddress = this.customer.shippingAddress as ShippingAddress;
                shippingAddress.firstName = values.address.firstName;
                shippingAddress.lastName = values.address.lastName;
                shippingAddress.companyName = values.address.companyName;
                shippingAddress.streetName = values.address.streetName;
                shippingAddress.houseNumber = values.address.houseNumber;
                shippingAddress.zip = values.address.zip;
                shippingAddress.city = values.address.city;
                shippingAddress.country = values.address.country;
            });
        this.subscriptions.push(cartSubscription, billingFormSubscription, shippingFormSubscription);
    }

    private fillForms() {
        this.billingForm.patchValue({ email: this.customer.email });
        this.billingForm.patchValue({ address: this.customer.billingAddress });
        this.shippingForm.patchValue({ address: this.customer.shippingAddress });
    }

    get formsCompleted(): boolean {
        let allFormsCompleted: boolean = false;
        if (this.customer.shippingToBillingAddress) {
            allFormsCompleted = this.billingForm.valid;
        } else {
            allFormsCompleted = (this.billingForm.valid && this.shippingForm.valid);
        }
        this.checkoutSummaryService.updateOrderPageUnlocked(allFormsCompleted);
        return allFormsCompleted;
    }
}
