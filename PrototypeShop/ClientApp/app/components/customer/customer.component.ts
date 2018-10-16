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

    public customer: Customer;
    public shippingToggle: FormGroup;
    public billingForm: FormGroup;
    public shippingForm: FormGroup;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private formBuilder: FormBuilder) {
        this.shippingToggle = this.formBuilder.group({
            "shippingToBillingAddress": new FormControl()
        });
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
            });
        let shippingToggleSubscription: Subscription = this.shippingToggle.valueChanges.subscribe(
            (formValues: ISwitchFormValues) => {
                if (formValues.shippingToBillingAddress) {
                    this.customer.order.shippingAddress = this.customer.order.billingAddress;
                } else {
                    this.customer.order.shippingAddress = new BaseAddress();
                }
            });
        let billingFormSubscription: Subscription = this.billingForm.valueChanges.subscribe(
            (formValues: IAddressFormValues) => {
                this.customer.email = formValues.email;
                this.customer.order.billingAddress = formValues.address;
                this.formsCompleted();
            });
        let shippingFormSubscription: Subscription = this.shippingForm.valueChanges.subscribe(
            (formValues: IAddressFormValues) => {
                this.customer.order.shippingAddress = formValues.address;
                this.formsCompleted();
            });
        this.subscriptions.push(customerSubscription, shippingToggleSubscription, billingFormSubscription, shippingFormSubscription);
    }

    private fillForms() {
        this.shippingToggle.patchValue({ shippingToBillingAddress: (this.customer.order.shippingAddress === this.customer.order.billingAddress) });
        this.billingForm.patchValue({ email: this.customer.email });
        this.billingForm.patchValue({ address: this.customer.order.billingAddress });
        this.shippingForm.patchValue({ address: this.customer.order.shippingAddress });
    }

    private formsCompleted() {
        let allFormsCompleted: boolean = false;
        if (this.customer.order.shippingAddress == this.customer.order.billingAddress) {
            allFormsCompleted = this.billingForm.valid;
        } else {
            allFormsCompleted = (this.billingForm.valid && this.shippingForm.valid);
        }
        this.checkoutSummaryService.updateCustomerDetailsComplete(allFormsCompleted);
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
}

interface IAddressFormValues {
    email: string;
    address: BaseAddress;
}

interface ISwitchFormValues {
    shippingToBillingAddress: boolean;
}
