import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from '../../classes/customer/customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseAddress } from '../../classes/address/BaseAddress';

@Component({
    selector: 'customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public customer: Customer | undefined;
    public billingForm: FormGroup;
    public shippingForm: FormGroup;
    private shippingToBillingAddress: boolean = true;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private formBuilder: FormBuilder) {
        this.billingForm = this.formBuilder.group({
            "email":    new FormControl("", [Validators.required, Validators.email]),
            "address": this.formBuilder.group({
                "isPrimaryBillingAddress": false,
                "isPrimaryShippingAddress": false,
                "isTemplateAddress": false,
                "firstName": new FormControl("", Validators.required),
                "lastName": new FormControl("", Validators.required),
                "companyName": new FormControl(""),
                "streetName": new FormControl("", Validators.required),
                "houseNumber": new FormControl("", Validators.required),
                "additionalAddressLine": new FormControl(""),
                "postcode": new FormControl("", Validators.required),
                "city": new FormControl("", Validators.required),
                "municipality": new FormControl("", Validators.required),
                "country": new FormControl("", Validators.required)
            })          
        });
        this.shippingForm = this.formBuilder.group({
            "address": this.formBuilder.group({
                "isPrimaryBillingAddress": false,
                "isPrimaryShippingAddress": false,
                "isTemplateAddress": false,
                "firstName": new FormControl("", Validators.required),
                "lastName": new FormControl("", Validators.required),
                "companyName": new FormControl(""),
                "streetName": new FormControl("", Validators.required),
                "houseNumber": new FormControl("", Validators.required),
                "additionalAddressLine": new FormControl(""),
                "postcode": new FormControl("", Validators.required),
                "city": new FormControl("", Validators.required),
                "municipality": new FormControl("", Validators.required),
                "country": new FormControl("", Validators.required)
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
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
                this.fillForms();
            }
        );
        let billingFormSubscription: Subscription = this.billingForm.valueChanges.subscribe(
            (formValues: IFormValues) => {
                this.customer!.email = formValues.email;
                this.customer!.billingAddress = formValues.address;
                if (this.shippingToBillingAddress) {
                    this.customer!.shippingAddress = formValues.address;
                }
                this.formsCompleted();
            });
        let shippingFormSubscription: Subscription = this.shippingForm.valueChanges.subscribe(
            (formValues: IFormValues) => {
                this.customer!.shippingAddress = formValues.address;
                this.formsCompleted();
            });
        let shippingToBillingAddressSubscription: Subscription = this.checkoutSummaryService.shippingToBillingAddress$.subscribe(
            (shippingToBillingAddress: boolean) => {
                this.shippingToBillingAddress = shippingToBillingAddress;
            })
        this.subscriptions.push(customerSubscription, billingFormSubscription, shippingFormSubscription, shippingToBillingAddressSubscription);
    }

    private fillForms() {
        this.billingForm.patchValue({ email: this.customer!.email });
        this.billingForm.patchValue({ address: this.customer!.billingAddress });
        this.shippingForm.patchValue({ address: this.customer!.shippingAddress });
    }

    private formsCompleted() {
        let allFormsCompleted: boolean = false;
        if (this.customer!.shippingAddress == this.customer!.billingAddress) {
            allFormsCompleted = this.billingForm.valid;
        } else {
            allFormsCompleted = (this.billingForm.valid && this.shippingForm.valid);
        }
        this.checkoutSummaryService.updateCustomerDetailsComplete(allFormsCompleted);
    }
}

interface IFormValues {
    email: string;
    address: BaseAddress;
}
